import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🔍</span>
            <span className="brand-text">CU Lost & Found</span>
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu desktop-menu">
            <Link to="/browse" className="nav-link">Browse Items</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/report-lost" className="nav-link">Report Lost</Link>
                <Link to="/report-found" className="nav-link">Report Found</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link" style={{ color: '#EF4444', fontWeight: 700 }}>
                    <FiShield /> Admin
                  </Link>
                )}
                <div className="nav-user">
                  <Link to="/profile" className="nav-link user-link">
                    <FiUser /> {user?.fullName}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="navbar-menu mobile-menu">
            <Link to="/browse" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Browse Items
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/report-lost" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Report Lost
                </Link>
                <Link to="/report-found" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Report Found
                </Link>
                <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}
                    style={{ color: '#EF4444', fontWeight: 700 }}>
                    <FiShield /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-block">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-block" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
