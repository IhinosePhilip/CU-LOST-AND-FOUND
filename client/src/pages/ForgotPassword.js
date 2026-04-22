import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.match(/^[a-z]+\.[0-9]+@stu\.cu\.edu\.ng$/)) {
      toast.error('Please enter your CU school email (e.g. pihinose.260035@stu.cu.edu.ng)');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (error) {
      // Always show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-logo">📧</div>
              <h1>Check Your Email</h1>
              <p className="auth-subtitle">
                If an account exists for <strong>{email}</strong>, a password
                reset link has been sent to that address.
              </p>
              <div className="reset-info-box">
                <p>📌 Check your CU student email inbox at:</p>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '1rem' }}
                >
                  Open Gmail
                </a>
              </div>
              <div className="auth-footer">
                <p>
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    className="link-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    try again
                  </button>
                </p>
                <p><Link to="/login">← Back to Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-logo">🔐</div>
            <h1>Forgot Password?</h1>
            <p className="auth-subtitle">
              Enter your CU school email and we'll send a reset link to it.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">School Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="pihinose.260035@stu.cu.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  required
                />
                <small>Format: firstinitiallastname.regnumber@stu.cu.edu.ng</small>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="auth-footer">
              <p><Link to="/login">← Back to Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
