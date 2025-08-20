import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if admin token exists
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');
  
  if (!adminToken || !adminUser) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  try {
    // Verify admin user data is valid JSON
    JSON.parse(adminUser);
  } catch (error) {
    // If admin user data is invalid, clear storage and redirect
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedAdminRoute;
