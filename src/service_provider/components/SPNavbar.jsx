import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SPNavbar.css";

const menuItems = [
  { name: "Dashboard", path: "/service-provider" },
  { name: "Products", path: "/service-provider/products" },
  { name: "Orders", path: "/service-provider/orders" },
  { name: "Customers", path: "/service-provider/customers" },
  { name: "Analytics", path: "/service-provider/analytics" }
];

const SPNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== "/service-provider" && location.pathname.startsWith(path));
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileOptionClick = (action) => {
    setShowProfileDropdown(false);
    if (action === 'settings') {
      navigate('/service-provider/settings');
    } else if (action === 'logout') {
      console.log('Logging out...');
    }
  };

  return (
    <nav className="sp-navbar">
 
      <div className="sp-navbar__menu">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick(item.path)}
            className={`sp-navbar__item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.name}
          </button>
        ))}
      </div>

    </nav>
  );
};

export default SPNavbar; 