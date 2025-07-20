import React from 'react';
import { Route } from 'react-router-dom';
import MomPreganecyLayout from '../MomPreganecyLayout';
import Home from '../pages/Home';
import PregnancyCalculator from '../pages/PregnancyCalculator';
import BabyNameFinder from '../pages/PregnancyTrackerBabyNameFinder';
import PregnancyWeightGainCalculator from '../pages/Pregnancy WeightGainCalculator';


export default (
  <Route path="/mompreg" element={<MomPreganecyLayout />}>
    <Route index element={<Home />} />
    <Route path="pregnancycalculator" element={<PregnancyCalculator />} />
    <Route path="pregnancyweightcalculator" element={<PregnancyWeightGainCalculator />} />
    
    <Route path="babynamefinder" element={<BabyNameFinder />} />
    {/* Add more routes as needed */}
  </Route>
   
); 