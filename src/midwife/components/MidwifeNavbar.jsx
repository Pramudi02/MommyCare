import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path ||
           (path !== "/midwife" && location.pathname.startsWith(path));
  };

  return (
    <nav className="main-navbar">
      {menuItems.map((item, idx) => (
        <button
          key={idx}
          onClick={() => handleNavClick(item.path)}
          className={`main-navbar__item ${isActive(item.path) ? 'active' : ''}`}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
};

export default MidwifeNavbar; 