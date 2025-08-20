import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/routes/AdminRoutes';
import MomRoutes from './mom/routes/MomRoutes';
import MidwifeRoutes from './midwife/routes/MidwifeRoutes';
import DoctorRoutes from './doctor/routes/DoctorRoutes';
import SPRoutes from './service_provider/routes/SPRoutes';
import MainNavbar from './components/MainNavbar/MainNavbar';
import HeroSection from './components/HeroSection/HeroSection';
import HomeSection from './components/HomeSection/HomeSection';
import Footer from './components/Footer/footer';
import GetPermissionDoctor from './components/Authentication/GetPermissionDoctor';
import GetPermissionMidWife from './components/Authentication/GetPermissionMidWife';
import GetPermissionServiceProvider from './components/Authentication/GetPermissionServiceProvider';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import ForgotPassword from './components/Authentication/ForgotPassword';

function App() {

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Authentication Routes - No Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes - No Navbar/Footer */}
          {AdminRoutes}
          
          {/* Other Routes - With Navbar/Footer */}
          <Route path="/*" element={
            <>
              <MainNavbar />
              <Routes>
                {MomRoutes}
                {MidwifeRoutes}
                {DoctorRoutes}
                {SPRoutes}
                
                {/* Permission Routes */}
                <Route path="/get-permission-doctor" element={<GetPermissionDoctor />} />
                <Route path="/get-permission-midWife" element={<GetPermissionMidWife />} />
                <Route path="/get-permission-serviceProvider" element={<GetPermissionServiceProvider />} />
                
                {/* Home Route */}
                <Route path="/" element={
                  <>
                    <HeroSection />
                    <HomeSection />
                  </>
                } />
              </Routes>
              <Footer/>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;