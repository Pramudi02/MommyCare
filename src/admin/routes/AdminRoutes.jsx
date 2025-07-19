import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import Dashboard from '../pages/Dashboard';
import UsersPage from '../pages/Users';
import Mothers from '../pages/Mothers';
import HealthcareProviders from '../pages/HealthcareProviders';
import RoleAccessManagement from '../pages/RoleAccessManagement';
import Settings from '../pages/Settings';

export default (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="users/mothers" element={<Mothers />} />
    <Route path="users/providers" element={<HealthcareProviders />} />
    <Route path="users/roles" element={<RoleAccessManagement />} />
    <Route path="settings" element={<Settings />} />
  </Route>
); 