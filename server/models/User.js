const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow admin accounts OR valid CU student emails
        return v === 'admin@stu.cu.edu.ng' ||
               /^[a-z]+\.[0-9]+@stu\.cu\.edu\.ng$/.test(v);
      },
      message: 'Must be a valid CU student email (e.g. pihinose.260035@stu.cu.edu.ng)'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['100', '200', '300', '400', '500', 'Postgraduate', 'Staff']
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  itemsReported: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  itemsClaimed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  reputation: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
