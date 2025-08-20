import React from 'react';
import { Outlet } from 'react-router-dom';
import MidwifeNavbar from './components/MidwifeNavbar';

const MidwifeLayout = () => (
  <div>
    <MidwifeNavbar />
    <Outlet />
  </div>
);

export default MidwifeLayout; 