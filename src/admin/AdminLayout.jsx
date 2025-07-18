import React, { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import AdminFooter from "./components/AdminFooter";
import { Outlet } from "react-router-dom";
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="admin-layout">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`admin-main-content ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <AdminNavbar />
        <Outlet />
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
