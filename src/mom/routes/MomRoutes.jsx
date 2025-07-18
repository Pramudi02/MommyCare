import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';

export default (
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="profile" element={<Profile />} />
  </Route>
); 