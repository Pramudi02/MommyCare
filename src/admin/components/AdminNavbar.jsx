import React from "react";
import { Bell, Search, Plus } from "lucide-react";
import './AdminNavbar.css';

const AdminNavbar = () => (
  <header className="admin-navbar">
    <div className="navbar-container">
      <div className="navbar-content">
        <h1 className="navbar-title">Dashboard Overview</h1>
        <p className="navbar-subtitle">Welcome back! Here's what's happening with MaternityCare+ today.</p>
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
      </div>
    </div>
  </header>
);

export default AdminNavbar;
