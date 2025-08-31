import React from 'react';
import { Route } from 'react-router-dom';
import MidwifeLayout from '../MidwifeLayout';
import Dashboard from '../pages/Dashboard';
import MomsList from '../pages/MomsList';
import Appointments from '../pages/Appointments';
import MedicalRecords from '../pages/MedicalRecords';
import Analytics from '../pages/Analytics';
import Articles from '../pages/Education';
import Emergency from '../pages/Emergency';
import MidwifeChat from '../pages/MidwifeChat';

export default (
  <Route path="/midwife" element={<MidwifeLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="moms-list" element={<MomsList />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="medical-records" element={<MedicalRecords />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="articles" element={<Articles />} />
    <Route path="emergency" element={<Emergency />} />
    <Route path="chat" element={<MidwifeChat />} />
  </Route>
); 