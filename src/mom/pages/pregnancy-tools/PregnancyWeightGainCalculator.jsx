import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Target, Activity, Lightbulb, CheckCircle } from 'lucide-react';
import './PregnancyWeightGaincalculator.css';

const PregnancyCalculator = () => {
  const [formData, setFormData] = useState({
    prePregnancyWeight: '',
    currentWeight: '',
    height: '',
    heightUnit: 'cm',
    weekOfPregnancy: '',
    isMultiples: false
  });

  const [activeTab, setActiveTab] = useState('First Trimester');
  const [calculatedData, setCalculatedData] = useState({
    weightGain: 0,
    bmi: 0,
    recommendedRange: { min: 0, max: 0 },
    remaining: 0,
    weeksPregnant: 16
  });

  const tabs = ['First Trimester', 'Second Trimester', 'Third Trimester', 'Postpartum'];

  const weekOptions = Array.from({ length: 42 }, (_, i) => i + 1);

  const calculateBMI = (weight, height, unit) => {
    if (!weight || !height) return 0;
    const weightKg = parseFloat(weight);
    const heightM = unit === 'cm' ? parseFloat(height) / 100 : parseFloat(height) * 0.3048;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getRecommendedWeightGain = (bmi, isMultiples) => {
    if (isMultiples) {
      if (bmi < 18.5) return { min: 17, max: 25 };
      if (bmi >= 18.5 && bmi < 25) return { min: 17, max: 25 };
      if (bmi >= 25 && bmi < 30) return { min: 14, max: 23 };
      return { min: 11, max: 19 };
    } else {
      if (bmi < 18.5) return { min: 13, max: 18 };
      if (bmi >= 18.5 && bmi < 25) return { min: 11, max: 16 };
      if (bmi >= 25 && bmi < 30) return { min: 7, max: 11 };
      return { min: 5, max: 9 };
    }
  };

  const calculateWeightGain = () => {
    const { prePregnancyWeight, currentWeight, height, heightUnit, weekOfPregnancy, isMultiples } = formData;
    
    if (!prePregnancyWeight || !currentWeight || !height) {
      alert('Please fill in all required fields');
      return;
    }

    const weightGain = parseFloat(currentWeight) - parseFloat(prePregnancyWeight);
    const bmi = calculateBMI(prePregnancyWeight, height, heightUnit);
    const recommendedRange = getRecommendedWeightGain(parseFloat(bmi), isMultiples);
    const remaining = recommendedRange.max - weightGain;

    setCalculatedData({
      weightGain: weightGain.toFixed(1),
      bmi: parseFloat(bmi),
      recommendedRange,
      remaining: remaining.toFixed(1),
      weeksPregnant: parseInt(weekOfPregnancy) || 16
    });
  };

  const getWeightStatus = () => {
    const { weightGain, recommendedRange } = calculatedData;
    const gain = parseFloat(weightGain);
    if (gain < recommendedRange.min) return 'below';
    if (gain > recommendedRange.max) return 'above';
    return 'normal';
  };

  const getProgressPercentage = () => {
    const { weightGain, recommendedRange } = calculatedData;
    const gain = parseFloat(weightGain);
    const percentage = (gain / recommendedRange.max) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="pregnancy-calc-container">
      <div className="pregnancy-calc-content">
        {/* Header */}
        <header className="pregnancy-calc-header">
          <div className="pregnancy-calc-header-icon">
            <Calculator size={24} />
          </div>
          <h1 className="pregnancy-calc-title">Pregnancy Weight Gain Calculator</h1>
          <p className="pregnancy-calc-subtitle">
            Track your healthy weight journey with personalized recommendations and expert guidance throughout your pregnancy
          </p>
        </header>

        <div className="pregnancy-calc-main-layout">
          {/* Left Panel - Calculator Form */}
          <div className="pregnancy-calc-form-panel">
            <div className="pregnancy-calc-form-header">
              <Calculator size={16} />
              <h2>Calculate Your Weight Gain</h2>
            </div>

            {/* Trimester Tabs */}
            <div className="pregnancy-calc-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`pregnancy-calc-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="pregnancy-calc-form">
              <div className="pregnancy-calc-form-row">
                <div className="pregnancy-calc-form-group">
                  <label>Pre-pregnancy Weight</label>
                  <div className="pregnancy-calc-input-group">
                    <input
                      type="number"
                      placeholder="Enter weight"
                      value={formData.prePregnancyWeight}
                      onChange={(e) => setFormData({...formData, prePregnancyWeight: e.target.value})}
                    />
                    <span className="pregnancy-calc-unit">kg</span>
                  </div>
                </div>
                <div className="pregnancy-calc-form-group">
                  <label>Current Weight</label>
                  <div className="pregnancy-calc-input-group">
                    <input
                      type="number"
                      placeholder="Enter current weight"
                      value={formData.currentWeight}
                      onChange={(e) => setFormData({...formData, currentWeight: e.target.value})}
                    />
                    <span className="pregnancy-calc-unit">kg</span>
                  </div>
                </div>
              </div>

              <div className="pregnancy-calc-form-row">
                <div className="pregnancy-calc-form-group">
                  <label>Height</label>
                  <div className="pregnancy-calc-height-input">
                    <input
                      type="number"
                      placeholder="Your height"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                    <select
                      value={formData.heightUnit}
                      onChange={(e) => setFormData({...formData, heightUnit: e.target.value})}
                      className="pregnancy-calc-unit-select"
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pregnancy-calc-form-group">
                <label>Week of Pregnancy</label>
                <select
                  value={formData.weekOfPregnancy}
                  onChange={(e) => setFormData({...formData, weekOfPregnancy: e.target.value})}
                  className="pregnancy-calc-select"
                >
                  <option value="">Select your current week</option>
                  {weekOptions.map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>

              <div className="pregnancy-calc-checkbox-group">
                <label className="pregnancy-calc-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.isMultiples}
                    onChange={(e) => setFormData({...formData, isMultiples: e.target.checked})}
                  />
                  <span className="pregnancy-calc-checkmark"></span>
                  I'm carrying twins or multiples
                </label>
              </div>

              <button
                className="pregnancy-calc-calculate-btn"
                onClick={calculateWeightGain}
              >
                Calculate Weight Gain Recommendations
              </button>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="pregnancy-calc-result-panel">
            {/* Weight Gain Summary */}
            <div className="pregnancy-calc-result-card pregnancy-calc-summary-card">
              <div className="pregnancy-calc-card-header">
                <TrendingUp size={16} />
                <span>Weight Gain Summary</span>
              </div>
              <div className="pregnancy-calc-weight-display">
                <span className="pregnancy-calc-weight-value">
                  {calculatedData.weightGain > 0 ? '+' : ''}{calculatedData.weightGain} kg
                </span>
                <span className="pregnancy-calc-weight-label">Total Weight Gained</span>
              </div>
              <div className="pregnancy-calc-range-info">
                <div className="pregnancy-calc-range-item">
                  <span className="pregnancy-calc-range-label">Recommended Range</span>
                </div>
                <div className="pregnancy-calc-range-item">
                  <span className="pregnancy-calc-range-label">Minimum</span>
                  <span className="pregnancy-calc-range-value">{calculatedData.recommendedRange.min} kg</span>
                </div>
                <div className="pregnancy-calc-range-item">
                  <span className="pregnancy-calc-range-label">Maximum</span>
                  <span className="pregnancy-calc-range-value">{calculatedData.recommendedRange.max} kg</span>
                </div>
                <div className="pregnancy-calc-range-item">
                  <span className="pregnancy-calc-range-label">Remaining</span>
                  <span className="pregnancy-calc-range-value">{calculatedData.remaining} kg</span>
                </div>
              </div>
            </div>

            {/* Weeks Pregnant */}
            <div className="pregnancy-calc-result-card pregnancy-calc-weeks-card">
              <div className="pregnancy-calc-weeks-number">{calculatedData.weeksPregnant}</div>
              <div className="pregnancy-calc-weeks-label">Weeks Pregnant</div>
            </div>

            {/* BMI Analysis */}
            <div className="pregnancy-calc-result-card pregnancy-calc-bmi-card">
              <div className="pregnancy-calc-card-header">
                <Target size={16} />
                <span>BMI Analysis</span>
              </div>
              <div className="pregnancy-calc-bmi-value">
                <span className="pregnancy-calc-bmi-number">{calculatedData.bmi}</span>
                <span className="pregnancy-calc-bmi-label">Normal Weight</span>
                <CheckCircle size={16} className="pregnancy-calc-bmi-check" />
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="pregnancy-calc-result-card pregnancy-calc-progress-card">
              <div className="pregnancy-calc-card-header">
                <Activity size={16} />
                <span>Progress Tracking</span>
              </div>
              <div className="pregnancy-calc-progress-content">
                <span className="pregnancy-calc-progress-label">Weight Gain Progress</span>
                <span className="pregnancy-calc-progress-percentage">{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="pregnancy-calc-progress-bar">
                <div 
                  className="pregnancy-calc-progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="pregnancy-calc-progress-note">
                On track for healthy weight gain
              </div>
            </div>

            {/* Weekly Tips */}
            <div className="pregnancy-calc-result-card pregnancy-calc-tips-card">
              <div className="pregnancy-calc-card-header">
                <Lightbulb size={16} />
                <span>Weekly Tips</span>
              </div>
              <ul className="pregnancy-calc-tips-list">
                <li>Eat nutrient-dense foods for you and baby</li>
                <li>Stay hydrated with 8-10 glasses of water daily</li>
                <li>Include prenatal vitamins in your routine</li>
                <li>Gentle exercise like walking is beneficial</li>
                <li>Get adequate rest and sleep</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyCalculator;