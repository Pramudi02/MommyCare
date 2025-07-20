import React from "react";
import "./MainNavbar.css";

const menuItems = [
  "Pregnancy Tracker",
  "Birth & Baby",
  "Vaccinations",
  "Appointments",
  "Medical Reports",
  "Predictions",
  "Baby Product",
  "Communication"
];

const MainNavbar = () => {
  return (
    <nav className="main-navbar">
      {menuItems.map((item, idx) => (
        <a key={idx} href="#" className="main-navbar__item">
          {item}
        </a>
      ))}
    </nav>
  );
};

export default MainNavbar;