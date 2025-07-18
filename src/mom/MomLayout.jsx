import React from 'react';
import { Outlet } from 'react-router-dom';
import MomNavbar from './components/MomNavbar';
import Footer from '../components/shared/Footer';
import BabyToolsHeader from './components/BabyToolsHeader';

const MomLayout = () => (
  <div>
    <MomNavbar />
    <BabyToolsHeader/>
    <Outlet />
    <Footer />
  </div>
);

export default MomLayout; 