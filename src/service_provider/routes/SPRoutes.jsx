import React from 'react';
import { Route } from 'react-router-dom';
import SPLayout from '../SPLayout';
import Services from '../pages/Services';
import Appointments from '../pages/Appointments';
import Analytics from '../pages/Analytics';

export default (
  <Route path="/service-provider" element={<SPLayout />}>
    <Route index element={<Services />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="analytics" element={<Analytics />} />
  </Route>
); 