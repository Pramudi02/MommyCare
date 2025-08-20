import React from 'react';
import { Outlet } from 'react-router-dom';
import SPNavbar from './components/SPNavbar';

const SPLayout = () => (
  <div>
    <SPNavbar />
    <Outlet />
  </div>
);

export default SPLayout; 