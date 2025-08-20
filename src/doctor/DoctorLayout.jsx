import React from 'react';
import { Outlet } from 'react-router-dom';
import DoctorNavbar from './components/DoctorNavbar';

const DoctorLayout = () => (
  <div>
    <DoctorNavbar />
    <Outlet />
  </div>
);

export default DoctorLayout; 