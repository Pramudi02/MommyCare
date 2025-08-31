import React from 'react';
import { Outlet } from 'react-router-dom';
import MidwifeNavbar from './components/MidwifeNavbar';
import MidwifeFloatingChatWidget from '../components/MidwifeFloatingChatWidget';

const MidwifeLayout = () => (
  <div>
    <MidwifeNavbar />
    <Outlet />
    <MidwifeFloatingChatWidget />
  </div>
);

export default MidwifeLayout; 