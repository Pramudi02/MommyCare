import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/routes/AdminRoutes';
import MomRoutes from './mom/routes/MomRoutes';
import MidwifeRoutes from './midwife/routes/MidwifeRoutes';
import DoctorRoutes from './doctor/routes/DoctorRoutes';
import SPRoutes from './service_provider/routes/SPRoutes';
import MainNavbar from './components/MainNavbar/MainNavbar';

function App() {
  return (
    <Router>
      <MainNavbar />
      <Routes>
        {AdminRoutes}
        {MomRoutes}
        {MidwifeRoutes}
        {DoctorRoutes}
        {SPRoutes}
      </Routes>
    </Router>
  );
}

export default App;