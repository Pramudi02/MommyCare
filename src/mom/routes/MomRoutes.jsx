import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';
import BabyCostsCalculator from '../pages/BabyCostsCalculator';
import BabyNameFinder from '../pages/PregnancyTrackerBabyNameFinder';

export default (
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    <Route path="baby-costs-calculator" element={<BabyCostsCalculator />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="profile" element={<Profile />} />
    <Route path="babynamefinder" element={<BabyNameFinder />} />
    {/* Add more routes as needed */}
  </Route>
   
); 