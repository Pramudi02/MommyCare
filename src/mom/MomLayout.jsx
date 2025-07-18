import React from 'react';
import { Outlet } from 'react-router-dom';
import MomNavbar from './components/MomNavbar';
import Footer from '../components/shared/Footer';

const MomLayout = () => (
  <div>
    <MomNavbar />
    <Outlet />
    <Footer />
  </div>
);

export default MomLayout; 