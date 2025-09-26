import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="mommycare-footer">
      <div className="mommycare-footer-container">
        {/* Header Section */}
        <div className="mommycare-footer-header">
          <div className="mommycare-footer-logo">
            <img src="/mommy.png" alt="MommyCare Logo" className="mommycare-logo-image" />
          </div>
          <p className="mommycare-footer-description">
            Your trusted companion for pregnancy and baby care. We're here to support you through every step of your motherhood journey.
          </p>
        </div>

        {/* Main Content - Links and Stats Side by Side */}
        <div className="mommycare-footer-main">
          {/* Links Section */}
          <div className="mommycare-footer-links">
            <div className="mommycare-footer-column">
              <h3 className="mommycare-footer-column-title">Quick Links</h3>
              <ul className="mommycare-footer-list">
                <li><a href="/pregnancy-tracker" className="mommycare-footer-link">Pregnancy Tracker</a></li>
                <li><a href="/vaccinations" className="mommycare-footer-link">Vaccinations</a></li>
                <li><a href="/appointments" className="mommycare-footer-link">Appointments</a></li>
                <li><a href="/baby-products" className="mommycare-footer-link">Baby Products</a></li>
              </ul>
            </div>

            <div className="mommycare-footer-column">
              <h3 className="mommycare-footer-column-title">Support</h3>
              <ul className="mommycare-footer-list">
                <li><a href="/help-center" className="mommycare-footer-link">Help Center</a></li>
                <li><a href="/contact" className="mommycare-footer-link">Contact Us</a></li>
                <li><a href="/privacy-policy" className="mommycare-footer-link">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="mommycare-footer-link">Terms of Service</a></li>
              </ul>
            </div>

            <div className="mommycare-footer-column">
              <h3 className="mommycare-footer-column-title">Connect</h3>
              <ul className="mommycare-footer-list">
                <li><a href="https://facebook.com" className="mommycare-footer-link">Facebook</a></li>
                <li><a href="https://instagram.com" className="mommycare-footer-link">Instagram</a></li>
                <li><a href="https://twitter.com" className="mommycare-footer-link">Twitter</a></li>
                <li><a href="https://youtube.com" className="mommycare-footer-link">YouTube</a></li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mommycare-footer-stats">
            <div className="mommycare-stat-item">
              <span className="mommycare-stat-number">50K+</span>
              <span className="mommycare-stat-label">Happy Mothers</span>
            </div>
            <div className="mommycare-stat-item">
              <span className="mommycare-stat-number">4.9⭐</span>
              <span className="mommycare-stat-label">App Rating</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mommycare-footer-bottom">
          <p className="mommycare-footer-copyright">
            © 2025 MommyCare. All rights reserved. Made with love for mothers everywhere.

          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;