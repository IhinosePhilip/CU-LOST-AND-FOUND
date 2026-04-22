import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiAlertCircle, FiCheckCircle, FiUsers } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Lost Something? <br />
              <span className="gradient-text">We'll Help You Find It</span>
            </h1>
            <p className="hero-subtitle">
              Covenant University's digital lost and found platform. 
              Report lost items, browse found items, and reconnect with your belongings.
            </p>
            <div className="hero-buttons">
              <Link to="/browse" className="btn btn-primary btn-lg">
                <FiSearch /> Browse Items
              </Link>
              <Link to="/report-lost" className="btn btn-outline btn-lg">
                <FiAlertCircle /> Report Lost Item
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card">
              <span className="emoji">📱</span>
              <span className="emoji">💻</span>
              <span className="emoji">🎒</span>
              <span className="emoji">🔑</span>
              <span className="emoji">👓</span>
              <span className="emoji">⌚</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiAlertCircle size={32} />
              </div>
              <h3>Report Lost Item</h3>
              <p>Lost something? Create a detailed report with photos and description.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle size={32} />
              </div>
              <h3>Report Found Item</h3>
              <p>Found something? Log it in our system to help the owner find it.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiSearch size={32} />
              </div>
              <h3>Smart Matching</h3>
              <p>Our algorithm automatically matches lost and found items.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiUsers size={32} />
              </div>
              <h3>Secure Communication</h3>
              <p>Connect with finders/owners through our secure messaging system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Items Reported</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">200+</h3>
              <p className="stat-label">Successful Returns</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">1000+</h3>
              <p className="stat-label">Active Users</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">65%</h3>
              <p className="stat-label">Recovery Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Lost Item?</h2>
            <p>Join hundreds of CU students who have successfully recovered their belongings.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
