import React from 'react';
import { Outlet } from 'react-router-dom';
import PegnacyMomNavbar from './components/PegnacyMomNavbar';
import Footer from '../components/shared/Footer';
import PregnancyTool from './components/PregnancyToolHeader';

const MomPregnancyLayout = () => (
  <div>
    <PegnacyMomNavbar />
    <PregnancyTool/>
    <Outlet />
    <Footer />
  </div>
);

export default MomPregnancyLayout; 