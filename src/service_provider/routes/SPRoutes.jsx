import React from 'react';
import { Route } from 'react-router-dom';
import SPLayout from '../SPLayout';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Appointments from '../pages/Appointments';
import Customers from '../pages/Customers';
import Analytics from '../pages/Analytics';
import Services from '../pages/Services';
import Settings from '../pages/Settings';

export default (
  <Route path="/service-provider" element={<SPLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="orders" element={<Orders />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="customers" element={<Customers />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="services" element={<Services />} />
    <Route path="settings" element={<Settings />} />
  </Route>
); 