import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminLogin from '../components/AdminLogin';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import Dashboard from '../pages/Dashboard';
import UsersPage from '../pages/Users';
import Mothers from '../pages/Mothers';
import HealthcareProviders from '../pages/HealthcareProviders';
import RoleAccessManagement from '../pages/RoleAccessManagement';
import Settings from '../pages/Settings';

export default (
  <>
    {/* Public admin login route */}
    <Route path="/admin/login" element={<AdminLogin />} />
    
    {/* Protected admin routes */}
    <Route path="/admin" element={
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    }>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="users/mothers" element={<Mothers />} />
      <Route path="users/providers" element={<HealthcareProviders />} />
      <Route path="users/roles" element={<RoleAccessManagement />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </>
); 