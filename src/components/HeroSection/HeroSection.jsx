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
              <div className="hero-buttons">
                <button className="btnn-primary">MORE</button>
              </div>
            </div>
          </div>
          <div className="hero-indicators">
            <div className="indicator active"></div>
            <div className="indicator"></div>
            <div className="indicator"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <h2 className="features-title">Everything You Need — From Bump to Baby</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-chart">
                  <div className="chart-bars">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                    <div className="bar bar-3"></div>
                  </div>
                </div>
              </div>
              <h3>Pregnancy Tracker</h3>
              <p>Monitor your baby's growth with personalized insights and milestone tracking.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-baby">👶</div>
              </div>
              <h3>Birth & Baby Care</h3>
              <p>Comprehensive guides and tools for birth preparation and newborn care essentials.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-prediction">
                  <div className="prediction-circle">
                    <div className="prediction-dot"></div>
                  </div>
                </div>
              </div>
              <h3>Smart Predictions</h3>
              <p>AI-powered insights to predict your due date, baby's gender, and developmental milestones.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-calendar">
                  <div className="calendar-grid">
                    <div className="calendar-header"></div>
                    <div className="calendar-dates">
                      <div className="date-dot"></div>
                      <div className="date-dot"></div>
                      <div className="date-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3>Appointment Manager</h3>
              <p>Never miss important check-ups with our intelligent appointment scheduling and reminders.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-reports">
                  <div className="report-lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                </div>
              </div>
              <h3>Medical Reports</h3>
              <p>Securely store and access all your medical records and test results in one place.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-vaccine">💉</div>
              </div>
              <h3>Vaccination Tracker</h3>
              <p>Keep track of all necessary vaccinations for you and your baby with automated reminders.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-communication">
                  <div className="chat-bubble"></div>
                </div>
              </div>
              <h3>Expert Communication</h3>
              <p>Connect directly with healthcare providers and get answers to your questions 24/7.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-products">
                  <div className="shopping-bag">
                    <div className="bag-handle"></div>
                    <div className="bag-body"></div>
                  </div>
                </div>
              </div>
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