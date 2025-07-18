import React from 'react';
import { Route } from 'react-router-dom';
import MidwifeLayout from '../MidwifeLayout';
import Dashboard from '../pages/Dashboard';
import MomsList from '../pages/MomsList';
import Reports from '../pages/Reports';

export default (
  <Route path="/midwife" element={<MidwifeLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="moms-list" element={<MomsList />} />
    <Route path="reports" element={<Reports />} />
  </Route>
); 