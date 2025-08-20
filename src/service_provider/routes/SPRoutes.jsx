import React from 'react';
import { Route } from 'react-router-dom';
import SPLayout from '../SPLayout';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import ProductForm from '../pages/ProductForm';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

export default (
  <Route path="/service-provider" element={<SPLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="products/add" element={<ProductForm />} />
    <Route path="products/edit/:id" element={<ProductForm />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
); 