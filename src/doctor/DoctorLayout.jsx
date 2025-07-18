import React from 'react';
import { Outlet } from 'react-router-dom';
import DoctorNavbar from './components/DoctorNavbar';
import Footer from '../components/shared/Footer';

const DoctorLayout = () => (
  <div>
    <DoctorNavbar />
    <Outlet />
    <Footer />
  </div>
);

export default DoctorLayout; 