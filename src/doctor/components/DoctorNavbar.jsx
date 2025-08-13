import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DoctorNavbar.css";

const menuItems = [
  { name: "Dashboard", path: "/doctor" },
  { name: "Patients", path: "/doctor/patients" },
  { name: "Appointments", path: "/doctor/appointments" },
  { name: "Prescriptions", path: "/doctor/prescriptions" },
  { name: "Schedule", path: "/doctor/schedule" },
  { name: "Medical Records", path: "/doctor/medical-records" },
  { name: "Analytics", path: "/doctor/analytics" },
  { name: "Settings", path: "/doctor/settings" }
];

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== "/doctor" && location.pathname.startsWith(path));
  };

  return (
    <nav className="doctor-navbar">
      <div className="doctor-navbar__logo">
        <img src="/images/logo1.png" alt="MommyCare" />
        <span>Doctor Portal</span>
      </div>
      
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

      <div className="doctor-navbar__profile">
        <div className="doctor-avatar">
          <img src="/images/medical.jpg" alt="Doctor" />
        </div>
        <span>Dr. Sarah Johnson</span>
      </div>
    </nav>
  );
};

export default DoctorNavbar; 