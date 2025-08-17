import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './MidwifeNavbar.css';

const menuItems = [
  { name: 'Dashboard', path: '/midwife' },
  { name: 'Moms List', path: '/midwife/moms-list' },
  { name: 'Appointments', path: '/midwife/appointments' },
  { name: 'Medical Records', path: '/midwife/medical-records' },
  { name: 'Analytics', path: '/midwife/analytics' },
  { name: 'Articles', path: '/midwife/articles' },
  { name: 'Emergency', path: '/midwife/emergency' }
];

const MidwifeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close mobile menu when item is clicked
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ||
           (path !== "/midwife" && location.pathname.startsWith(path));
  };

  return (
    <nav className="main-navbar">
      {/* Mobile Toggle Button */}
      <button 
        className="main-navbar__toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Navigation Items */}
      <div className={`main-navbar__menu ${isMenuOpen ? 'open' : ''}`}>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick(item.path)}
            className={`main-navbar__item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MidwifeNavbar; 