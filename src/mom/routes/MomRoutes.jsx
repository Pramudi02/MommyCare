// MommyCare/src/mom/routes/MomRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import BabyCostsCalculator from '../pages/BabyCostsCalculator';
import BabyNameFinder from '../pages/PregnancyTrackerBabyNameFinder';
import MyAppointments from '../pages/appointments/MyAppointments';

export default (
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    <Route path="baby-costs-calculator" element={<BabyCostsCalculator />} />
    <Route path="profile" element={<Profile />} />
    <Route path="babynamefinder" element={<BabyNameFinder />} />
    <Route path="myappointments" element={<MyAppointments />} />
  </Route>
   
); 