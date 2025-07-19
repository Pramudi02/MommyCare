
import React from 'react';
import { Search, Heart } from 'lucide-react';
import './MomNavbar.css';

const MomNavbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <Heart className="heart-icon" fill="currentColor" />
            </div>
            <span className="logo-text">
              MommyCare
            </span>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-icon-wrapper">
                <Search className="search-icon" />
              </div>
              <input
                type="text"
                placeholder="Search baby care tips, products..."
                className="search-input"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            <button className="login-btn">
              Login
            </button>
            <button className="signup-btn">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MomNavbar; 
