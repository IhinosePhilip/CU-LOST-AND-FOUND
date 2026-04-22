import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    department: '',
    level: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const levels = ['100', '200', '300', '400', '500', 'Postgraduate', 'Staff'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.email.match(/^[a-z]+\.[0-9]+@stu\.cu\.edu\.ng$/)) {
      toast.error('Email must be in format: pihinose.260035@stu.cu.edu.ng');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-logo">🔍</div>
            <h1>Create Account</h1>
            <p className="auth-subtitle">Join CU Lost &amp; Found community</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="e.g. Philip Ihinose"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">School Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="pihinose.260035@stu.cu.edu.ng"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <small>Format: firstinitiallastname.regnumber@stu.cu.edu.ng</small>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-input"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    name="department"
                    className="form-input"
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select
                    name="level"
                    className="form-select"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Level</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
