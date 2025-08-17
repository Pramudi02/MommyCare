import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MomNavbar.css";

const menuItems = [
  { name: "Pregnancy Tracker", path: "/mom/pregnancy-tracker" },
  { name: "Birth & Baby", path: "/mom/birth-baby" },
  { name: "Vaccinations", path: "/mom/vaccinations" },
  { name: "Appointments", path: "/mom/appointments" },
  { name: "Medical Reports", path: "/mom/medical-reports" },
  { name: "Predictions", path: "/mom/predictions" },
  { name: "Baby Product", path: "/mom/baby-product" },
  { name: "Communication", path: "/mom/communication" }
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="main-navbar">
      {/* Toggle Button - Always visible on mobile */}
      <button
        className="main-navbar__toggle"
        aria-expanded={isOpen}
        aria-controls="mom-navbar-menu"
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
        type="button"
      >
        <span className={`toggle-bar ${isOpen ? 'rotate-45' : ''}`} />
        <span className={`toggle-bar ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`toggle-bar ${isOpen ? 'rotate-negative-45' : ''}`} />
      </button>

      {/* Navigation Menu */}
      <div 
        id="mom-navbar-menu" 
        className={`main-navbar__menu ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick(item.path)}
            className={`main-navbar__item ${isActive(item.path) ? 'active' : ''}`}
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Overlay for mobile - closes menu when clicked outside */}
      {isOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;