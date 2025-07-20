import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';
import BabyCostsCalculator from '../pages/BabyCostsCalculator';
import MaternalHealthHub from '../pages/MaternalHealthHub';  
import ChildGrowthChart from '../pages/ChildGrowthChart';
import FeedingSolutions from '../pages/FeedingSolutions';
import DoctorVisitsGuide from '../pages/DoctorVisitsGuide';
// import FeedingSolutions from '../pages/FeedingSolutions';
// import BabyDoctorVisit from '../pages/DoctorVisitsGuide';

export default (
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    <Route path="baby-costs-calculator" element={<BabyCostsCalculator />}/>
    <Route path='maternal-health-hub' element={<MaternalHealthHub/>}/>
    <Route path='child-growth-chart' element={<ChildGrowthChart/>}/>
    <Route path='feeding-solutions' element={<FeedingSolutions/>}/>
    <Route path='doctor-visits-guide' element={<DoctorVisitsGuide/>}/>
    <Route path="appointments" element={<Appointments />} />
    <Route path="profile" element={<Profile />} />

  </Route>
); 