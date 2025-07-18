import React from 'react';
import { Route } from 'react-router-dom';
import DoctorLayout from '../DoctorLayout';
import Patients from '../pages/Patients';
import Prescriptions from '../pages/Prescriptions';
import Schedule from '../pages/Schedule';

export default (
  <Route path="/doctor" element={<DoctorLayout />}>
    <Route index element={<Patients />} />
    <Route path="prescriptions" element={<Prescriptions />} />
    <Route path="schedule" element={<Schedule />} />
  </Route>
); 