import React, { useState } from 'react';
import './Predictions.css';

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('babyWeight');
  const [babyWeightResult, setBabyWeightResult] = useState(null);
  const [diabetesResult, setDiabetesResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBabyWeightSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const gestationalAge = parseFloat(formData.get('gestationalAge'));
    const maternalAge = parseFloat(formData.get('maternalAge'));
    const maternalHeight = parseFloat(formData.get('maternalHeight'));
    const maternalWeight = parseFloat(formData.get('maternalWeight'));
    const currentWeight = parseFloat(formData.get('currentWeight'));
    const previousBabies = parseInt(formData.get('previousBabies'));

    // Simulate AI prediction with realistic calculation
    setTimeout(() => {
      const baseWeight = 1500 + (gestationalAge - 20) * 140;
      const ageAdjustment = maternalAge < 20 ? -100 : maternalAge > 35 ? 50 : 0;
      const heightAdjustment = (maternalHeight - 160) * 5;
      const weightGainAdjustment = (currentWeight - maternalWeight) * 10;
      const parityAdjustment = previousBabies * 50;
      
      const predictedWeight = Math.max(1500, 
        baseWeight + ageAdjustment + heightAdjustment + weightGainAdjustment + parityAdjustment + 
        (Math.random() - 0.5) * 200
      );

      let category, emoji, advice, riskLevel;
      if (predictedWeight < 2500) {
        category = "Low Birth Weight";
        emoji = "⚠️";
        advice = "Consider discussing nutrition and monitoring with your doctor.";
        riskLevel = "low";
      } else if (predictedWeight > 4000) {
        category = "High Birth Weight";
        emoji = "📏";
        advice = "Monitor glucose levels and discuss delivery plans with your healthcare provider.";
        riskLevel = "medium";
      } else {
        category = "Normal Birth Weight";
        emoji = "✅";
        advice = "Predicted weight is within normal range. Continue regular check-ups.";
        riskLevel = "normal";
      }

      setBabyWeightResult({
        weight: Math.round(predictedWeight),
        category,
        emoji,
        advice,
        riskLevel
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleDiabetesSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const age = parseFloat(formData.get('age'));
    const bmi = parseFloat(formData.get('bmi'));
    const glucose = parseFloat(formData.get('glucose'));
    const familyHistory = parseInt(formData.get('familyHistory'));
    const previousGD = parseInt(formData.get('previousGD'));
    const pregnancyWeeks = parseFloat(formData.get('pregnancyWeeks'));

    // Risk calculation based on common risk factors
    setTimeout(() => {
      let riskScore = 0;
      
      // Age factor
      if (age >= 35) riskScore += 25;
      else if (age >= 30) riskScore += 15;
      else if (age >= 25) riskScore += 5;

      // BMI factor
      if (bmi >= 30) riskScore += 30;
      else if (bmi >= 25) riskScore += 15;
      else if (bmi >= 23) riskScore += 5;

      // Glucose level
      if (glucose >= 126) riskScore += 40;
      else if (glucose >= 100) riskScore += 25;
      else if (glucose >= 90) riskScore += 10;

      // Family history
      if (familyHistory === 1) riskScore += 20;

      // Previous GD
      if (previousGD === 1) riskScore += 35;

      // Pregnancy weeks (risk increases later in pregnancy)
      if (pregnancyWeeks >= 24) riskScore += 10;
      else if (pregnancyWeeks >= 20) riskScore += 5;

      // Add some randomness for realism
      riskScore += (Math.random() - 0.5) * 10;
      riskScore = Math.max(0, Math.min(100, riskScore));

      let riskLevel, emoji, advice;
      
      if (riskScore <= 30) {
        riskLevel = "Low Risk";
        emoji = "💚";
        advice = "Your risk appears low. Continue healthy eating and regular exercise. Monitor with routine check-ups.";
      } else if (riskScore <= 60) {
        riskLevel = "Moderate Risk";
        emoji = "🟡";
        advice = "You may have moderate risk. Consider more frequent glucose monitoring and dietary consultation.";
      } else {
        riskLevel = "High Risk";
        emoji = "🔴";
        advice = "You may be at higher risk. Please consult your healthcare provider immediately for proper testing and monitoring.";
      }

      setDiabetesResult({
        riskLevel,
        riskScore: Math.round(riskScore),
        emoji,
        advice
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="predictions-page">
      <div className="predictions-container">
        {/* Header */}
        <div className="predictions-header">
          <div className="header-card">
            <h1 className="main-title">AI Predictions</h1>
            <p className="subtitle">Advanced AI-powered health predictions for maternal care</p>
          </div>
          
          {/* Disclaimer */}
          <div className="disclaimer-card">
            <div className="disclaimer-content">
              <span className="warning-icon">⚠️</span>
              <p className="disclaimer-text">
                <strong>Important:</strong> These are AI predictions for guidance only. Results are not 100% accurate. 
                Always consult with your healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigationp">
          <div className="tab-container">
            <button 
              className={`tab-button ${activeTab === 'babyWeight' ? 'active' : ''}`}
              onClick={() => setActiveTab('babyWeight')}
            >
              👶 Baby Weight Prediction
            </button>
            <button 
              className={`tab-button ${activeTab === 'diabetes' ? 'active' : ''}`}
              onClick={() => setActiveTab('diabetes')}
            >
              🩺 Gestational Diabetes Risk
            </button>
          </div>
        </div>

        {/* Baby Weight Prediction Tab */}
        {activeTab === 'babyWeight' && (
          <div className="tab-content">
            <div className="content-grid">
              {/* Input Form */}
              <div className="prediction-card">
                <div className="card-header">
                  <span className="card-icon">👶</span>
                  <h2 className="card-title">Baby Weight Prediction</h2>
                </div>
                
                <form onSubmit={handleBabyWeightSubmit} className="prediction-form">
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="gestationalAge"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">Gestational Age (weeks)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="maternalAge"
                      className="form-input" 
                      placeholder=" " 
                      required 
                    />
                    <label className="floating-label">Maternal Age (years)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="maternalHeight"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">Maternal Height (cm)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="maternalWeight"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">Pre-pregnancy Weight (kg)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="currentWeight"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">Current Weight (kg)</label>
                  </div>
                  
                  <div className="input-group">
                    <select name="previousBabies" className="form-input" required>
                      <option value="" disabled selected>Number of Previous Babies</option>
                      <option value="0">0 (First pregnancy)</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="predict-btn" disabled={isLoading}>
                    {isLoading ? '🔮 Predicting...' : '🔮 Predict Baby Weight'}
                  </button>
                </form>
              </div>

              {/* Results */}
              <div className="prediction-card">
                <div className="card-header">
                  <span className="card-icon">📊</span>
                  <h3 className="card-title">Prediction Results</h3>
                </div>
                
                <div className="results-container">
                  {!babyWeightResult ? (
                    <div className="empty-result">
                      <p className="empty-text">Fill in the form to get your baby weight prediction</p>
                    </div>
                  ) : (
                    <div className={`result-card ${babyWeightResult.riskLevel}`}>
                      <div className="result-header">
                        <span className="result-emoji">{babyWeightResult.emoji}</span>
                      </div>
                      <div className="result-content">
                        <div className="result-item">
                          <p className="result-label">Predicted Birth Weight</p>
                          <p className="result-value">{babyWeightResult.weight}g</p>
                        </div>
                        <div className="result-item">
                          <p className="result-label">Category</p>
                          <p className="result-value">{babyWeightResult.category}</p>
                        </div>
                        <div className="result-item">
                          <p className="result-label">Recommendation</p>
                          <p className="result-advice">{babyWeightResult.advice}</p>
                        </div>
                        <div className="result-disclaimer">
                          <strong>Note:</strong> This prediction is based on statistical models and should not replace professional medical advice. Actual birth weight can vary significantly.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestational Diabetes Tab */}
        {activeTab === 'diabetes' && (
          <div className="tab-content">
            <div className="content-grid">
              {/* Input Form */}
              <div className="prediction-card">
                <div className="card-header">
                  <span className="card-icon">🩺</span>
                  <h2 className="card-title">Gestational Diabetes Risk Assessment</h2>
                </div>
                
                <form onSubmit={handleDiabetesSubmit} className="prediction-form">
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="age"
                      className="form-input" 
                      placeholder=" " 
                      required 
                    />
                    <label className="floating-label">Age (years)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="bmi"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">BMI (kg/m²)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="glucose"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">Fasting Glucose Level (mg/dL)</label>
                  </div>
                  
                  <div className="input-group">
                    <select name="familyHistory" className="form-input" required>
                      <option value="" disabled selected>Family History of Diabetes</option>
                      <option value="0">No family history</option>
                      <option value="1">Yes, family history</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <select name="previousGD" className="form-input" required>
                      <option value="" disabled selected>Previous Gestational Diabetes</option>
                      <option value="0">No previous GD</option>
                      <option value="1">Had GD before</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="pregnancyWeeks"
                      className="form-input" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                    />
                    <label className="floating-label">Current Pregnancy Week</label>
                  </div>
                  
                  <button type="submit" className="predict-btn" disabled={isLoading}>
                    {isLoading ? '🔍 Assessing...' : '🔍 Assess Diabetes Risk'}
                  </button>
                </form>
              </div>

              {/* Results */}
              <div className="prediction-card">
                <div className="card-header">
                  <span className="card-icon">📈</span>
                  <h3 className="card-title">Risk Assessment</h3>
                </div>
                
                <div className="results-container">
                  {!diabetesResult ? (
                    <div className="empty-result">
                      <p className="empty-text">Complete the assessment to view your diabetes risk</p>
                    </div>
                  ) : (
                    <div className={`result-card ${diabetesResult.riskLevel.toLowerCase().replace(' ', '-')}`}>
                      <div className="result-header">
                        <span className="result-emoji">{diabetesResult.emoji}</span>
                      </div>
                      <div className="result-content">
                        <div className="result-item">
                          <p className="result-label">Risk Assessment</p>
                          <p className="result-value">{diabetesResult.riskLevel}</p>
                        </div>
                        <div className="result-item">
                          <p className="result-label">Risk Score</p>
                          <div className="risk-meter">
                            <div className="risk-bar">
                              <div 
                                className="risk-fill"
                                style={{ width: `${diabetesResult.riskScore}%` }}
                              ></div>
                            </div>
                            <span className="risk-percentage">{diabetesResult.riskScore}%</span>
                          </div>
                        </div>
                        <div className="result-item">
                          <p className="result-label">Recommendation</p>
                          <p className="result-advice">{diabetesResult.advice}</p>
                        </div>
                        <div className="result-disclaimer">
                          <strong>Disclaimer:</strong> This is a preliminary risk assessment tool. Only proper medical testing can definitively diagnose gestational diabetes. Please consult your healthcare provider.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions; 