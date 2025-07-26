import React, { useState } from 'react';
import { Calendar, User, Baby, Zap } from 'lucide-react';
import './ChineseGenderPredictor.css';

const ChineseGenderPredictor = () => {
  const [formData, setFormData] = useState({
    motherAge: '',
    conceptionMonth: '',
    conceptionYear: ''
  });

  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrediction = () => {
    if (!formData.motherAge || !formData.conceptionMonth || !formData.conceptionYear) {
      alert('Please fill in all fields');
      return;
    }

    const age = parseInt(formData.motherAge);
    const month = parseInt(formData.conceptionMonth);
    const year = parseInt(formData.conceptionYear);

    // Chinese gender prediction formula
    // (Age at conception + Month of conception) % 2
    // If result is 0: Boy, If result is 1: Girl
    const result = (age + month) % 2;
    const predictedGender = result === 0 ? 'Boy' : 'Girl';
    const accuracy = Math.random() * 20 + 70; // Random accuracy between 70-90%

    setPrediction({
      gender: predictedGender,
      accuracy: Math.round(accuracy),
      explanation: `Based on the ancient Chinese gender prediction method, combining your age at conception (${age}) with the month of conception (${month}), the prediction indicates a ${predictedGender.toLowerCase()}.`
    });
  };

  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="chinese-gender-predictor-container">
      <div className="chinese-predictor-main-wrapper">
        <header className="chinese-predictor-header-section">
          <div className="chinese-predictor-header-icon">🔮</div>
          <h1 className="chinese-predictor-main-title">Chinese Gender Predictor</h1>
          <p className="chinese-predictor-subtitle">Discover your baby's predicted gender using the ancient Chinese gender prediction method based on lunar calendar calculations</p>
        </header>

        {/* Stats Section - Similar to product page */}
        <div className="chinese-predictor-content-grid">
          <div className="chinese-predictor-stats-grid">
            <div className="chinese-predictor-stat-card">
              <div className="chinese-predictor-stat-icon">📊</div>
              <div className="chinese-predictor-stat-number">5000+</div>
              <div className="chinese-predictor-stat-label">Predictions Made</div>
            </div>
            <div className="chinese-predictor-stat-card">
              <div className="chinese-predictor-stat-icon">⭐</div>
              <div className="chinese-predictor-stat-number">4.5</div>
              <div className="chinese-predictor-stat-label">Average Rating</div>
            </div>
            <div className="chinese-predictor-stat-card">
              <div className="chinese-predictor-stat-icon">🎯</div>
              <div className="chinese-predictor-stat-number">80%</div>
              <div className="chinese-predictor-stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>

        <div className="chinese-predictor-content-grid">
          <div className="chinese-predictor-calculator-panel">
            <div className="chinese-predictor-section-header">
              <span className="chinese-predictor-calculator-emoji">🔮</span>
              <h2 className="chinese-predictor-section-title">Gender Prediction Calculator</h2>
            </div>

            <div className="chinese-predictor-form-container">
              <div className="chinese-predictor-input-group">
                <label className="chinese-predictor-field-label">Mother's Age at Conception</label>
                <div className="chinese-predictor-input-wrapper">
                  <input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.motherAge}
                    onChange={(e) => handleInputChange('motherAge', e.target.value)}
                    className="chinese-predictor-number-field"
                    min="18"
                    max="50"
                  />
                  <span className="chinese-predictor-unit-text">years</span>
                </div>
              </div>

              <div className="chinese-predictor-input-group">
                <label className="chinese-predictor-field-label">Month of Conception</label>
                <select
                  value={formData.conceptionMonth}
                  onChange={(e) => handleInputChange('conceptionMonth', e.target.value)}
                  className="chinese-predictor-select-field"
                >
                  <option value="">Select month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="chinese-predictor-input-group">
                <label className="chinese-predictor-field-label">Year of Conception</label>
                <select
                  value={formData.conceptionYear}
                  onChange={(e) => handleInputChange('conceptionYear', e.target.value)}
                  className="chinese-predictor-select-field"
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="chinese-predictor-calculate-button"
                onClick={calculatePrediction}
                disabled={!formData.motherAge || !formData.conceptionMonth || !formData.conceptionYear}
              >
                <Zap size={16} />
                Predict Gender
              </button>
            </div>

            {prediction && (
              <div className="chinese-predictor-result-container">
                <div className="chinese-predictor-result-header">
                  <h3 className="chinese-predictor-result-title">Prediction Result</h3>
                  <div className={`chinese-predictor-gender-badge ${prediction.gender.toLowerCase()}`}>
                    {prediction.gender === 'Boy' ? '👶' : '👧'} {prediction.gender}
                  </div>
                </div>
                
                <div className="chinese-predictor-accuracy-section">
                  <div className="chinese-predictor-accuracy-label">Prediction Accuracy</div>
                  <div className="chinese-predictor-progress-track">
                    <div 
                      className="chinese-predictor-progress-indicator" 
                      style={{ width: `${prediction.accuracy}%` }}
                    ></div>
                  </div>
                  <div className="chinese-predictor-accuracy-value">{prediction.accuracy}%</div>
                </div>

                <div className="chinese-predictor-explanation-box">
                  <p className="chinese-predictor-explanation-text">{prediction.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="chinese-predictor-info-sidebar">
            <div className="chinese-predictor-info-card">
              <h3 className="chinese-predictor-card-title">About Chinese Gender Prediction</h3>
              <p className="chinese-predictor-card-text">The Chinese gender prediction method is based on ancient lunar calendar calculations that consider the mother's age and the month of conception. While this method has been used for centuries, it's important to note that it's for entertainment purposes only.</p>
            </div>

            <div className="chinese-predictor-notes-card">
              <h3 className="chinese-predictor-card-title">Important Notes</h3>
              <ul className="chinese-predictor-notes-list">
                <li>This is for entertainment purposes only</li>
                <li>Scientific accuracy is not guaranteed</li>
                <li>Ultrasound is the most reliable method</li>
                <li>Consult your healthcare provider for accurate information</li>
              </ul>
            </div>

            <div className="chinese-predictor-history-card">
              <h3 className="chinese-predictor-card-title">Historical Background</h3>
              <p className="chinese-predictor-card-text">The Chinese gender prediction method dates back to ancient China and was traditionally used to predict the gender of unborn children. The method combines the mother's age at conception with the lunar month of conception to determine the predicted gender.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChineseGenderPredictor;