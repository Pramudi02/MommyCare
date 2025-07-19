//MomRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';
import BabyCostsCalculator from '../pages/BabyCostsCalculator';
import Vaccination from '../pages/vaccination/Vaccination'; 
import MyAppointments from '../pages/appointments/MyAppointments'; 
import BabyProducts from '../pages/babyproducts/BabyProducts'; 



export default (
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    <Route path="baby-costs-calculator" element={<BabyCostsCalculator />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="profile" element={<Profile />} />
    <Route path="vaccination" element={<Vaccination />} /> 
    <Route path="myappointments" element={<MyAppointments />} /> 
    <Route path="babyproducts" element={<BabyProducts />} /> 

  </Route>
); 