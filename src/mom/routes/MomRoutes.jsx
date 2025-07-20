//MomRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import MomLayout from '../MomLayout';
import Home from '../pages/Home';
import Appointments from '../pages/Appointments';
import Profile from '../pages/Profile';
import Vaccinations from '../pages/Vaccinations';
import MedicalReports from '../pages/MedicalReports';
import Predictions from '../pages/Predictions';
import BabyProduct from '../pages/BabyProduct';
import Communication from '../pages/Communication';
import VaccinationSchedule from '../pages/vaccinationschedule/VaccinationSchedule';

// Pregnancy Tracker Tools
import DueDateCalculator from '../pages/pregnancy-tools/DueDateCalculator';
import BabyNameFinder from '../pages/pregnancy-tools/PregnancyTrackerBabyNameFinder.jsx';
import PregnancyWeightGainCalculator from '../pages/pregnancy-tools/PregnancyWeightGainCalculator';
import BirthPlanWorksheet from '../pages/pregnancy-tools/BirthPlanWorksheet';
import ChineseGenderPredictor from '../pages/pregnancy-tools/ChineseGenderPredictor';
import Registry from '../pages/pregnancy-tools/Registry';

// Birth & Baby Tools
import BabyCostsCalculator from '../pages/baby-tools/BabyCostsCalculator';
import MaternalHealthHub from '../pages/baby-tools/MaternalHealthHub';
import ChildGrowthChart from '../pages/baby-tools/ChildGrowthChart';
import FeedingSolutions from '../pages/baby-tools/FeedingSolutions';
import DoctorVisitsGuide from '../pages/baby-tools/DoctorVisitsGuide';

export default (
  
  <Route path="/mom" element={<MomLayout />}>
    <Route index element={<Home />} />
    
    {/* Pregnancy Tracker Section */}
    <Route path="pregnancy-tracker">
      <Route index element={<DueDateCalculator />} />
      <Route path="due-date-calculator" element={<DueDateCalculator />} />
      <Route path="baby-name-finder" element={<BabyNameFinder />} />
      <Route path="weight-gain-calculator" element={<PregnancyWeightGainCalculator />} />
      <Route path="birth-plan-worksheet" element={<BirthPlanWorksheet />} />
      <Route path="chinese-gender-predictor" element={<ChineseGenderPredictor />} />
      <Route path="registry" element={<Registry />} />
    </Route>

    {/* Birth & Baby Section */}
    <Route path="birth-baby">
      <Route index element={<BabyCostsCalculator />} />
      <Route path="baby-costs-calculator" element={<BabyCostsCalculator />} />
      <Route path="maternal-health-hub" element={<MaternalHealthHub />} />
      <Route path="child-growth-chart" element={<ChildGrowthChart />} />
      <Route path="feeding-solutions" element={<FeedingSolutions />} />
      <Route path="doctor-visits-guide" element={<DoctorVisitsGuide />} />
    </Route>

    {/* Other Sections */}
    <Route path="vaccinations" element={<Vaccinations />} />
    <Route path="vaccinationschedule" element={<VaccinationSchedule />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="medical-reports" element={<MedicalReports />} />
    <Route path="predictions" element={<Predictions />} />
    <Route path="baby-product" element={<BabyProduct />} />
    <Route path="communication" element={<Communication />} />
    <Route path="profile" element={<Profile />} />
  </Route>
); 