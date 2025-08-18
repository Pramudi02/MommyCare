import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      {/* Hero Main Section */}
      <div className="hero-main">
        <div className="hero-content">
          <div className="hero-text">
            <div className="text-content">
              <h1>Your Journey to Motherhood,Beautifully Guided</h1>
              <p>Track your pregnancy, manage appointments, monitor vaccinations, and connect with healthcare providers - all in one caring platform designed forexpecting mothers.</p>
              {/* Removed action button as requested */}
            </div>
          </div>
          {/* Indicators removed as requested */}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <h2 className="features-title">Everything You Need — From Bump to Baby</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/5982375/pexels-photo-5982375.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Pregnancy Tracker</h3>
              <p>Monitor your baby's growth with personalized insights and milestone tracking.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/119604/baby-foot-blanket-newborn-119604.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Birth & Baby Care</h3>
              <p>Comprehensive guides and tools for birth preparation and newborn care essentials.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/9215242/pexels-photo-9215242.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Smart Predictions</h3>
              <p>AI-powered insights to predict your due date, baby's gender, and developmental milestones.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/5327659/pexels-photo-5327659.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Appointment Manager</h3>
              <p>Never miss important check-ups with our intelligent appointment scheduling and reminders.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/7578799/pexels-photo-7578799.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Medical Reports</h3>
              <p>Securely store and access all your medical records and test results in one place.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/8413214/pexels-photo-8413214.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Vaccination Tracker</h3>
              <p>Keep track of all necessary vaccinations for you and your baby with automated reminders.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/7195119/pexels-photo-7195119.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Expert Communication</h3>
              <p>Connect directly with healthcare providers and get answers to your questions 24/7.</p>
            </div>

            <div className="feature-card">
              <img
                src="https://images.pexels.com/photos/32713291/pexels-photo-32713291.jpeg"
                alt="Pregnancy Test"
                className="feature-image"
              />
              <h3>Baby Products</h3>
              <p>Curated selection of safe, high-quality products for your pregnancy and baby's needs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;