import React from 'react';
import { Route } from 'react-router-dom';
import DoctorLayout from '../DoctorLayout';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Prescriptions from '../pages/Prescriptions';
import MedicalRecords from '../pages/MedicalRecords';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';

export default (
  <Route path="/doctor" element={<DoctorLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="patients" element={<Patients />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="prescriptions" element={<Prescriptions />} />
    <Route path="medical-records" element={<MedicalRecords />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
); 