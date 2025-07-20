//MomLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MomNavbar from './components/MomNavbar';
import Footer from '../components/shared/Footer';
import BabyToolsHeader from './components/BabyToolsHeader';
import PregnancyTool from './components/PregnancyToolHeader';

const MomLayout = () => {
  const location = useLocation();
  
  // Check if we're in the pregnancy tracker section
  const isPregnancyTracker = location.pathname.includes('/mom/pregnancy-tracker');
  // Check if we're in the birth & baby section
  const isBirthBaby = location.pathname.includes('/mom/birth-baby');

  return (
    <div>
      <MomNavbar />
      {isPregnancyTracker && <PregnancyTool />}
      {isBirthBaby && <BabyToolsHeader />}
      <Outlet />
    </div>
  );
};

export default MomLayout; 