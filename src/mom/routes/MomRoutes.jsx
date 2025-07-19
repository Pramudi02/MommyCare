import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import BabyCostsCalculator from '../pages/BabyCostsCalculator';
import BabyNameFinder from '../pages/PregnancyTrackerBabyNameFinder';
import MyAppointments from '../pages/Appointments/MyAppointments';

export default (
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    <Route path="baby-costs-calculator" element={<BabyCostsCalculator />} />
    <Route path="profile" element={<Profile />} />
    <Route path="babynamefinder" element={<BabyNameFinder />} />
    <Route path="myappointments" element={<MyAppointments />} />
    {/* Add more routes as needed */}
  </Route>
   
); 