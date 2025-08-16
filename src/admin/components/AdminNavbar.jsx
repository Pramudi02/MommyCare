import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Plus, User, LogOut, Settings, ChevronDown } from "lucide-react";
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      try {
        setAdminUser(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing admin user:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <h1 className="navbar-title">Dashboard Overview</h1>
          <p className="navbar-subtitle">Welcome back! Here's what's happening with MommyCare today.</p>
        </div>
        <div className="navbar-actions">
          <button className="navbar-btn">
            <Bell className="navbar-btn-icon" />
          </button>
          <button className="navbar-btn">
            <Search className="navbar-btn-icon" />
          </button>
          <button className="quick-action-btn">
            <Plus className="quick-action-icon" />
            Quick Action
          </button>
          
          {/* User Menu */}
          <div className="user-menu-container">
            <button className="user-menu-btn" onClick={toggleUserMenu}>
              <div className="user-avatar">
                <User className="user-avatar-icon" />
              </div>
              <div className="user-info">
                <span className="user-name">{adminUser?.username || 'Admin'}</span>
                <span className="user-role">{adminUser?.role || 'Administrator'}</span>
              </div>
              <ChevronDown className={`chevron-icon ${showUserMenu ? 'rotated' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      <User className="dropdown-avatar-icon" />
                    </div>
                    <div>
                      <div className="dropdown-name">{adminUser?.username || 'Admin'}</div>
                      <div className="dropdown-email">{adminUser?.email || 'admin@mommycare.com'}</div>
                    </div>
                  </div>
                </div>
                <div className="dropdown-actions">
                  <button className="dropdown-action">
                    <Settings className="dropdown-action-icon" />
                    Settings
                  </button>
                  <button className="dropdown-action logout" onClick={handleLogout}>
                    <LogOut className="dropdown-action-icon" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
