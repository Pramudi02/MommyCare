import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/routes/AdminRoutes';
import MomRoutes from './mom/routes/MomRoutes';
import MidwifeRoutes from './midwife/routes/MidwifeRoutes';
import DoctorRoutes from './doctor/routes/DoctorRoutes';
import SPRoutes from './service_provider/routes/SPRoutes';
import MomPregnacyRoutes from './mom/routes/MomPregnacyRoutes';
import MainNavbar from './components/MainNavbar/MainNavbar';
import HeroSection from './components/HeroSection/HeroSection';
import HomeSection from './components/HomeSection/HomeSection';
import MomNavbar from './mom/components/MomNavbar';
import SignUp from './components/Authentication/SignUp/SignUp';
import Login from './components/Authentication/Login/Login';
import Footer from './components/Footer/footer';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSignUpOpen = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLoginOpen = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleCloseModals = () => {
    setShowSignUp(false);
    setShowLogin(false);
  };

  return (
    <Router>
      <div className="app-container">
        <MomNavbar
          onSignUpClick={handleSignUpOpen}
          onLoginClick={handleLoginOpen}
        />

        <MainNavbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <HomeSection />
              </>
            }
          />

          {AdminRoutes}
          {MomRoutes}
          {MidwifeRoutes}
          {DoctorRoutes}
          {SPRoutes}
          {MomPregnacyRoutes}
          {/* Add more routes as needed */}

        </Routes>
        <Footer />
        {/* Modals */}
        <SignUp isOpen={showSignUp} onClose={handleCloseModals} />
        <Login isOpen={showLogin} onClose={handleCloseModals} />
      </div>
    </Router>
  );
}

export default App;