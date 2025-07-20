import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Header Section */}
        <div className="footer-header">
          <div className="footer-logo">
            <div className="bg-gradient-to-br from-blue-400 to-pink-400 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              MommyCare
            </span>
          </div>
          <p className="footer-description">
            Your trusted companion for pregnancy and baby care. We're here to support you through every step of your motherhood journey.
          </p>
        </div>

        {/* Main Content - Links and Stats Side by Side */}
        <div className="footer-main">
          {/* Links Section */}
          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-column-title">Quick Links</h3>
              <ul className="footer-list">
                <li><a href="/pregnancy-tracker" className="footer-link">Pregnancy Tracker</a></li>
                <li><a href="/vaccinations" className="footer-link">Vaccinations</a></li>
                <li><a href="/appointments" className="footer-link">Appointments</a></li>
                <li><a href="/baby-products" className="footer-link">Baby Products</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Support</h3>
              <ul className="footer-list">
                <li><a href="/help-center" className="footer-link">Help Center</a></li>
                <li><a href="/contact" className="footer-link">Contact Us</a></li>
                <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="footer-link">Terms of Service</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Connect</h3>
              <ul className="footer-list">
                <li><a href="https://facebook.com" className="footer-link">Facebook</a></li>
                <li><a href="https://instagram.com" className="footer-link">Instagram</a></li>
                <li><a href="https://twitter.com" className="footer-link">Twitter</a></li>
                <li><a href="https://youtube.com" className="footer-link">YouTube</a></li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Mothers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9⭐</span>
              <span className="stat-label">App Rating</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 MommyCare. All rights reserved. Made with ❤️ for mothers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;