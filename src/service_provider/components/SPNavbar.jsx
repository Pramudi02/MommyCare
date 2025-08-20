import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut
} from "lucide-react";
import "./SPNavbar.css";

const menuItems = [
  { name: "Dashboard", path: "/service-provider" },
  { name: "Products", path: "/service-provider/products" },
  { name: "Add Product", path: "/service-provider/products/add" }
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
    if (action === 'profile') {
      navigate('/service-provider/profile');
    } else if (action === 'settings') {
      navigate('/service-provider/settings');
    } else if (action === 'logout') {
      console.log('Logging out...');
      // Handle logout logic here
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

      <div className="sp-navbar__profile">
        <button 
          className="sp-profile-button"
          onClick={handleProfileClick}
        >
          <User className="w-5 h-5" />
          <span>Sarah Johnson</span>
        </button>
        
        {showProfileDropdown && (
          <div className="sp-profile-dropdown">
            <button 
              className="sp-dropdown-item"
              onClick={() => handleProfileOptionClick('profile')}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button 
              className="sp-dropdown-item"
              onClick={() => handleProfileOptionClick('settings')}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="sp-dropdown-divider"></div>
            <button 
              className="sp-dropdown-item sp-dropdown-item-danger"
              onClick={() => handleProfileOptionClick('logout')}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SPNavbar; 