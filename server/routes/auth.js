const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? '90d' : '1d'
  });
};

// Email transporter (uses Gmail or falls back to Ethereal for dev)
const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  // Dev fallback: Ethereal fake SMTP (logs email to console)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
  return { transporter, testAccount };
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('email').custom(value => {
    if (!/^[a-z]+\.[0-9]+@stu\.cu\.edu\.ng$/.test(value)) {
      throw new Error('Email must be in format: pihinose.260035@stu.cu.edu.ng');
    }
    return true;
  }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('level').notEmpty().withMessage('Level is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password, fullName, phoneNumber, department, level } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      email,
      password,
      fullName,
      phoneNumber,
      department,
      level,
      verificationToken,
      verificationTokenExpiry
    });

    // TODO: Send verification email
    // For now, auto-verify in development
    if (process.env.NODE_ENV === 'development') {
      user.verified = true;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        level: user.level,
        verified: user.verified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password, rememberMe } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id, rememberMe);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        level: user.level,
        verified: user.verified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('itemsReported', 'title category status type')
      .populate('itemsClaimed', 'title category status type');

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        department: user.department,
        level: user.level,
        verified: user.verified,
        role: user.role,
        reputation: user.reputation,
        itemsReported: user.itemsReported,
        itemsClaimed: user.itemsClaimed,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: error.message
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset link to school email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"CU Lost & Found" <${process.env.EMAIL_USER || 'noreply@culostandfound.com'}>`,
      to: user.email,
      subject: 'CU Lost & Found - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6B46C1; padding: 2rem; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🔍 CU Lost & Found</h1>
          </div>
          <div style="background: #f9f9f9; padding: 2rem; border-radius: 0 0 8px 8px;">
            <h2>Password Reset Request</h2>
            <p>Hi <strong>${user.fullName}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${resetUrl}"
                style="background: #6B46C1; color: white; padding: 1rem 2rem;
                       text-decoration: none; border-radius: 8px; font-weight: bold;
                       display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p style="color: #666; font-size: 0.875rem;">
              This link expires in <strong>1 hour</strong>.<br/>
              If you didn't request this, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 1.5rem 0;" />
            <p style="color: #999; font-size: 0.75rem;">
              CU Lost & Found — Covenant University Campus<br/>
              This email was sent to ${user.email}
            </p>
          </div>
        </div>
      `
    };

    try {
      const result = await createTransporter();
      const transporter = result.transporter || result;
      const info = await transporter.sendMail(mailOptions);

      // In dev, log the preview URL
      if (result.testAccount) {
        console.log('\n📧 Password reset email preview:');
        console.log('   URL:', nodemailer.getTestMessageUrl(info));
        console.log('   (Open this URL to see the email)\n');
      }
    } catch (emailError) {
      console.error('Email send error:', emailError.message);
      // Don't fail the request if email fails — log the reset URL in dev
      console.log('\n🔗 DEV RESET LINK (email not configured):');
      console.log('  ', resetUrl, '\n');
    }

    res.json({
      success: true,
      message: 'If an account exists, a reset link has been sent to your school email.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
