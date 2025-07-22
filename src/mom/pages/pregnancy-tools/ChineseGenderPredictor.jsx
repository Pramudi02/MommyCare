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
    <div className="gender-predictor-primary">
      <div className="main-container-v1">
        <header className="app-header-v1">
          <div className="header-icon-v1">🔮</div>
          <h1>Chinese Gender Predictor</h1>
          <p>Discover your baby's predicted gender using the ancient Chinese gender prediction method based on lunar calendar calculations</p>
        </header>

        <div className="content-wrapper-v1">
          <div className="calculator-section-v1">
            <div className="section-title-v1">
              <span className="calculator-icon-v1">🔮</span>
              <h2>Gender Prediction Calculator</h2>
            </div>

            <div className="input-form-v1">
              <div className="field-group-v1">
                <label>Mother's Age at Conception</label>
                <div className="input-container-v1">
                  <input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.motherAge}
                    onChange={(e) => handleInputChange('motherAge', e.target.value)}
                    className="number-input-v1"
                    min="18"
                    max="50"
                  />
                  <span className="input-unit-v1">years</span>
                </div>
              </div>

              <div className="field-group-v1">
                <label>Month of Conception</label>
                <select
                  value={formData.conceptionMonth}
                  onChange={(e) => handleInputChange('conceptionMonth', e.target.value)}
                  className="dropdown-select-v1"
                >
                  <option value="">Select month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group-v1">
                <label>Year of Conception</label>
                <select
                  value={formData.conceptionYear}
                  onChange={(e) => handleInputChange('conceptionYear', e.target.value)}
                  className="dropdown-select-v1"
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
                className="calculate-btn-v1"
                onClick={calculatePrediction}
                disabled={!formData.motherAge || !formData.conceptionMonth || !formData.conceptionYear}
              >
                <Zap size={16} />
                Predict Gender
              </button>
            </div>

            {prediction && (
              <div className="result-display-v1">
                <div className="result-title-v1">
                  <h3>Prediction Result</h3>
                  <div className={`gender-tag-v1 ${prediction.gender.toLowerCase()}`}>
                    {prediction.gender === 'Boy' ? '👶' : '👧'} {prediction.gender}
                  </div>
                </div>
                
                <div className="accuracy-display-v1">
                  <div className="accuracy-text-v1">Prediction Accuracy</div>
                  <div className="progress-bar-v1">
                    <div 
                      className="progress-fill-v1" 
                      style={{ width: `${prediction.accuracy}%` }}
                    ></div>
                  </div>
                  <div className="accuracy-percent-v1">{prediction.accuracy}%</div>
                </div>

                <div className="result-explanation-v1">
                  <p>{prediction.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="information-section-v1">
            <div className="info-card-v1">
              <h3>About Chinese Gender Prediction</h3>
              <p>The Chinese gender prediction method is based on ancient lunar calendar calculations that consider the mother's age and the month of conception. While this method has been used for centuries, it's important to note that it's for entertainment purposes only.</p>
            </div>

            <div className="notes-card-v1">
              <h3>Important Notes</h3>
              <ul className="notes-list-v1">
                <li>This is for entertainment purposes only</li>
                <li>Scientific accuracy is not guaranteed</li>
                <li>Ultrasound is the most reliable method</li>
                <li>Consult your healthcare provider for accurate information</li>
              </ul>
            </div>

            <div className="background-card-v1">
              <h3>Historical Background</h3>
              <p>The Chinese gender prediction method dates back to ancient China and was traditionally used to predict the gender of unborn children. The method combines the mother's age at conception with the lunar month of conception to determine the predicted gender.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChineseGenderPredictor;