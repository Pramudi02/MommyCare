import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  // Define feature card data with navigation paths
  const featureCards = [
    {
      id: 1,
      title: "Pregnancy Tracker",
      description: "Monitor your baby's growth with personalized insights and milestone tracking.",
      image: "https://images.pexels.com/photos/5982375/pexels-photo-5982375.jpeg",
      path: "/mom/pregnancy-tracker"
    },
    {
      id: 2,
      title: "Birth & Baby Care",
      description: "Comprehensive guides and tools for birth preparation and newborn care essentials.",
      image: "https://images.pexels.com/photos/119604/baby-foot-blanket-newborn-119604.jpeg",
      path: "/mom/birth-baby"
    },
    {
      id: 3,
      title: "Smart Predictions",
      description: "AI-powered insights to predict your due date, baby's gender, and developmental milestones.",
      image: "https://images.pexels.com/photos/9215242/pexels-photo-9215242.jpeg",
      path: "/mom/predictions"
    },
    {
      id: 4,
      title: "Appointment Manager",
      description: "Never miss important check-ups with our intelligent appointment scheduling and reminders.",
      image: "https://images.pexels.com/photos/5327659/pexels-photo-5327659.jpeg",
      path: "/mom/appointments"
    },
    {
      id: 5,
      title: "Medical Reports",
      description: "Securely store and access all your medical records and test results in one place.",
      image: "https://images.pexels.com/photos/7578799/pexels-photo-7578799.jpeg",
      path: "/mom/medical-reports"
    },
    {
      id: 6,
      title: "Vaccination Tracker",
      description: "Keep track of all necessary vaccinations for you and your baby with automated reminders.",
      image: "https://images.pexels.com/photos/8413214/pexels-photo-8413214.jpeg",
      path: "/mom/vaccinations"
    },
    {
      id: 7,
      title: "Expert Communication",
      description: "Connect directly with healthcare providers and get answers to your questions 24/7.",
      image: "https://images.pexels.com/photos/7195119/pexels-photo-7195119.jpeg",
      path: "/mom/communication"
    },
    {
      id: 8,
      title: "Baby Products",
      description: "Curated selection of safe, high-quality products for your pregnancy and baby's needs.",
      image: "https://images.pexels.com/photos/32713291/pexels-photo-32713291.jpeg",
      path: "/mom/baby-product"
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

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
            {featureCards.map((feature) => (
              <div 
                key={feature.id}
                className="feature-card"
                onClick={() => handleFeatureClick(feature.path)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-image"
                />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;