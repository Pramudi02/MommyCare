import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Orders from '../pages/Orders';
import Settings from '../pages/Settings';

export default (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="users" element={<Users />} />
    <Route path="orders" element={<Orders />} />
    <Route path="settings" element={<Settings />} />
  </Route>
); 