import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DoctorNavbar.css";

const menuItems = [
  { name: "Dashboard", path: "/doctor" },
  { name: "Patients", path: "/doctor/patients" },
  { name: "Appointments", path: "/doctor/appointments" },
  { name: "Prescriptions", path: "/doctor/prescriptions" },
  { name: "Medical Records", path: "/doctor/medical-records" },
  { name: "Analytics", path: "/doctor/analytics" },
  { name: "Chat", path: "/doctor/chat" }
];

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== "/doctor" && location.pathname.startsWith(path));
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileOptionClick = (action) => {
    setShowProfileDropdown(false);
    if (action === 'settings') {
      navigate('/doctor/settings');
    } else if (action === 'logout') {
      // Handle logout logic here
      console.log('Logging out...');
      // You can add actual logout logic like clearing tokens, redirecting to login, etc.
    }
  };

  return (
    <nav className="doctor-navbar">
      
      <div className="doctor-navbar__menu">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick(item.path)}
            className={`doctor-navbar__item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      
      
    </nav>
  );
};

export default DoctorNavbar; 