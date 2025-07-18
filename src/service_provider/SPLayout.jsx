import React from 'react';
import { Outlet } from 'react-router-dom';
import SPNavbar from './components/SPNavbar';
import Footer from '../components/shared/Footer';

const SPLayout = () => (
  <div>
    <SPNavbar />
    <Outlet />
    <Footer />
  </div>
);

export default SPLayout; 