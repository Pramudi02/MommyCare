import React, { useState } from 'react';
import './PregnancyWeightGaincalculator.css';

const PregnancyCalculator = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [formData, setFormData] = useState({
    preWeight: '',
    currentWeight: '',
    heightFt: '',
    heightIn: '',
    heightCm: '',
    age: '',
    week: '',
    twins: false
  });

  const [results, setResults] = useState({
    weightGain: 2.5,
    minRange: 11.5,
    maxRange: 16,
    remaining: 8,
    weeksPregnant: 16,
    bmi: 22.4,
    bmiStatus: 'Normal Weight'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateRecommendations = () => {
    // Add your calculation logic here
    console.log('Calculating recommendations...');
  };

  return (
    <div className="pregnancy-calculator">
      <div className="container">
        <header className="header">
          <div className="icon">👶</div>
          <h1>Pregnancy Weight Gain Calculator</h1>
          <p>Track your healthy weight journey with personalized recommendations and expert guidance throughout your pregnancy</p>
        </header>

        <div className="main-content">
          <div className="calculator-section">
            <div className="section-header">
              <span className="calculator-icon">📊</span>
              <h2>Calculate Your Weight Gain</h2>
            </div>

            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'first' ? 'active' : ''}`}
                onClick={() => setActiveTab('first')}
              >
                First Trimester
              </button>
              <button 
                className={`tab ${activeTab === 'second' ? 'active' : ''}`}
                onClick={() => setActiveTab('second')}
              >
                Second Trimester
              </button>
              <button 
                className={`tab ${activeTab === 'third' ? 'active' : ''}`}
                onClick={() => setActiveTab('third')}
              >
                Third Trimester
              </button>
              <button 
                className={`tab ${activeTab === 'postpartum' ? 'active' : ''}`}
                onClick={() => setActiveTab('postpartum')}
              >
                Postpartum
              </button>
            </div>

            <div className="calculator-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pre-pregnancy Weight</label>
                  <div className="input-with-unit">
                    <input 
                      type="number" 
                      placeholder="Enter weight"
                      value={formData.preWeight}
                      onChange={(e) => handleInputChange('preWeight', e.target.value)}
                    />
                    <span className="unit">kg</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Current Weight</label>
                  <div className="input-with-unit">
                    <input 
                      type="number" 
                      placeholder="Enter current weight"
                      value={formData.currentWeight}
                      onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    />
                    <span className="unit">kg</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Height</label>
                  <div className="height-inputs">
                    <div className="input-with-unit">
                      <input 
                        type="number" 
                        placeholder="ft"
                        value={formData.heightFt}
                        onChange={(e) => handleInputChange('heightFt', e.target.value)}
                      />
                      <span className="unit">ft</span>
                    </div>
                    <div className="input-with-unit">
                      <input 
                        type="number" 
                        placeholder="in"
                        value={formData.heightIn}
                        onChange={(e) => handleInputChange('heightIn', e.target.value)}
                      />
                      <span className="unit">in</span>
                    </div>
                    <div className="input-with-unit">
                      <input 
                        type="number" 
                        placeholder="cm"
                        value={formData.heightCm}
                        onChange={(e) => handleInputChange('heightCm', e.target.value)}
                      />
                      <span className="unit">cm</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <div className="input-with-unit">
                    <input 
                      type="number" 
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Week of Pregnancy</label>
                <select 
                  className="week-select"
                  value={formData.week}
                  onChange={(e) => handleInputChange('week', e.target.value)}
                >
                  <option value="">Select your current week</option>
                  {Array.from({length: 40}, (_, i) => (
                    <option key={i+1} value={i+1}>Week {i+1}</option>
                  ))}
                </select>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.twins}
                    onChange={(e) => handleInputChange('twins', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  I'm carrying twins or multiples
                </label>
              </div>

              <button type="button" className="calculate-btn" onClick={calculateRecommendations}>
                Calculate Weight Gain Recommendations
              </button>
            </div>
          </div>

          <div className="results-section">
            <div className="weight-summary">
              <div className="summary-header">
                <span className="summary-icon">📊</span>
                <span>Weight Gain Summary</span>
              </div>
              <div className="weight-gain">
                <span className="gain-value">+{results.weightGain} kg</span>
                <span className="gain-label">Total Weight Gained</span>
              </div>
              <div className="recommendations">
                <div className="rec-item">
                  <span className="rec-label">Recommended Range</span>
                </div>
                <div className="rec-item">
                  <span className="rec-label">Minimum</span>
                  <span className="rec-value">{results.minRange} kg</span>
                </div>
                <div className="rec-item">
                  <span className="rec-label">Maximum</span>
                  <span className="rec-value">{results.maxRange} kg</span>
                </div>
                <div className="rec-item">
                  <span className="rec-label">Remaining</span>
                  <span className="rec-value">{results.remaining} kg</span>
                </div>
              </div>
            </div>

            <div className="weeks-pregnant">
              <div className="weeks-number">{results.weeksPregnant}</div>
              <div className="weeks-label">Weeks Pregnant</div>
            </div>

            <div className="bmi-analysis">
              <div className="bmi-header">
                <span className="bmi-icon">📊</span>
                <span>BMI Analysis</span>
              </div>
              <div className="bmi-value">{results.bmi}</div>
              <div className="bmi-status">
                <span>{results.bmiStatus}</span>
                <span className="check-icon">✓</span>
              </div>
            </div>

            <div className="progress-tracking">
              <div className="progress-header">
                <span className="progress-icon">📈</span>
                <span>Progress Tracking</span>
                <span className="progress-percentage">70%</span>
              </div>
              <div className="progress-label">Weight Gain Progress</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '70%'}}></div>
              </div>
              <div className="progress-note">Gaining at healthy weight pace</div>
            </div>

            <div className="weekly-tips">
              <div className="tips-header">
                <span className="tips-icon">💡</span>
                <span>Weekly Tips</span>
              </div>
              <ul className="tips-list">
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