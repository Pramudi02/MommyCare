import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from 'react-icons/fi';
import "./DoctorNavbar.css";

const menuItems = [
  { name: "Dashboard", path: "/doctor" },
  { name: "Patients", path: "/doctor/patients" },
  { name: "Appointments", path: "/doctor/appointments" },
  { name: "Appointment Requests", path: "/doctor/appointment-requests" },
  { name: "Prescriptions", path: "/doctor/prescriptions" },
  { name: "Medical Records", path: "/doctor/medical-records" },
  { name: "Analytics", path: "/doctor/analytics" },
  { name: "Chat", path: "/doctor/chat" }
];

const DoctorNavbar = () => {
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
    return location.pathname === path || (path !== "/doctor" && location.pathname.startsWith(path));
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

export default DoctorNavbar; 