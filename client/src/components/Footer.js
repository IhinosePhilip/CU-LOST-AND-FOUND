import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CU Lost & Found</h3>
            <p>Helping Covenant University students recover lost items efficiently.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/browse">Browse Items</a></li>
              <li><a href="/report-lost">Report Lost</a></li>
              <li><a href="/report-found">Report Found</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@culostandfound.com</p>
            <p>Campus Security: +234 XXX XXX XXXX</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 CU Lost & Found. All rights reserved.</p>
          <p>Made with ❤️ by CU Students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
