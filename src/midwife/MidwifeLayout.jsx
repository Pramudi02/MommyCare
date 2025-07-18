import React from 'react';
import { Outlet } from 'react-router-dom';
import MidwifeNavbar from './components/MidwifeNavbar';
import Footer from '../components/shared/Footer';

const MidwifeLayout = () => (
  <div>
    <MidwifeNavbar />
    <Outlet />
    <Footer />
  </div>
);

export default MidwifeLayout; 