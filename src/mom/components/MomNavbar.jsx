import React from "react";
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

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
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

export default Navigation;