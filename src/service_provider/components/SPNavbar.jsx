import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  Plus,
  Package,
  BarChart3
} from "lucide-react";
import "./SPNavbar.css";

const menuItems = [
  { name: "Dashboard", path: "/service-provider", icon: <BarChart3 className="w-4 h-4" /> },
  { name: "Products", path: "/service-provider/products", icon: <Package className="w-4 h-4" /> },
  { name: "Add Product", path: "/service-provider/products/add", icon: <Plus className="w-4 h-4" /> }
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
      <div className="sp-navbar__brand">
        <h2>Service Provider</h2>
      </div>

      <div className="sp-navbar__menu">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick(item.path)}
            className={`sp-navbar__item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
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