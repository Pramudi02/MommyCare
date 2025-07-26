import React, { useState, useEffect } from 'react';
import { Baby, Stethoscope, AlertTriangle, BarChart3, CheckCircle, Loader2, Brain } from 'lucide-react';
import './Predictions.css';

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('babyWeight');
  const [babyWeightResult, setBabyWeightResult] = useState(null);
  const [diabetesResult, setDiabetesResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for Baby Weight Prediction
  const sampleBabyWeightData = {
    gestationalAge: 35,
    maternalAge: 28,
    maternalHeight: 165,
    maternalWeight: 51,
    currentWeight: 56,
    previousBabies: 0
  };

  // Sample data for Diabetes Risk Assessment
  const sampleDiabetesData = {
    age: 32,
    bmi: 26.5,
    glucose: 95,
    familyHistory: 0,
    previousGD: 0,
    pregnancyWeeks: 24
  };

  // Function to calculate baby weight prediction
  const calculateBabyWeight = (data) => {
    const { gestationalAge, maternalAge, maternalHeight, maternalWeight, currentWeight, previousBabies } = data;
    
    const baseWeight = 1500 + (gestationalAge - 20) * 140;
    const ageAdjustment = maternalAge < 20 ? -100 : maternalAge > 35 ? 50 : 0;
    const heightAdjustment = (maternalHeight - 160) * 5;
    const weightGainAdjustment = (currentWeight - maternalWeight) * 10;
    const parityAdjustment = previousBabies * 50;
    
    const predictedWeight = Math.max(1500, 
      baseWeight + ageAdjustment + heightAdjustment + weightGainAdjustment + parityAdjustment + 
      (Math.random() - 0.5) * 200
    );

    let category, icon, advice, riskLevel;
    if (predictedWeight < 2500) {
      category = "Low Birth Weight";
      icon = <AlertTriangle size={32} className="text-yellow-500" />;
      advice = "Consider discussing nutrition and monitoring with your doctor.";
      riskLevel = "low";
    } else if (predictedWeight > 4000) {
      category = "High Birth Weight";
      icon = <BarChart3 size={32} className="text-purple-500" />;
      advice = "Monitor glucose levels and discuss delivery plans with your healthcare provider.";
      riskLevel = "medium";
    } else {
      category = "Normal Birth Weight";
      icon = <CheckCircle size={32} className="text-green-500" />;
      advice = "Predicted weight is within normal range. Continue regular check-ups.";
      riskLevel = "normal";
    }

    return {
      weight: Math.round(predictedWeight),
      category,
      icon,
      advice,
      riskLevel
    };
  };

  // Function to calculate diabetes risk
  const calculateDiabetesRisk = (data) => {
    const { age, bmi, glucose, familyHistory, previousGD, pregnancyWeeks } = data;
    
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

    let riskLevel, icon, advice;
    
    if (riskScore <= 30) {
      riskLevel = "Low Risk";
      icon = <CheckCircle size={32} className="text-green-500" />;
      advice = "Your risk appears low. Continue healthy eating and regular exercise. Monitor with routine check-ups.";
    } else if (riskScore <= 60) {
      riskLevel = "Moderate Risk";
      icon = <BarChart3 size={32} className="text-yellow-500" />;
      advice = "You may have moderate risk. Consider more frequent glucose monitoring and dietary consultation.";
    } else {
      riskLevel = "High Risk";
      icon = <AlertTriangle size={32} className="text-red-500" />;
      advice = "You may be at higher risk. Please consult your healthcare provider immediately for proper testing and monitoring.";
    }

    return {
      riskLevel,
      riskScore: Math.round(riskScore),
      icon,
      advice
    };
  };

  // Remove automatic submission - user will submit manually

  const handleBabyWeightSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      gestationalAge: parseFloat(formData.get('gestationalAge')),
      maternalAge: parseFloat(formData.get('maternalAge')),
      maternalHeight: parseFloat(formData.get('maternalHeight')),
      maternalWeight: parseFloat(formData.get('maternalWeight')),
      currentWeight: parseFloat(formData.get('currentWeight')),
      previousBabies: parseInt(formData.get('previousBabies'))
    };

    // Simulate AI prediction
    setTimeout(() => {
      const result = calculateBabyWeight(data);
      setBabyWeightResult(result);
      setIsLoading(false);
    }, 1500);
  };

  const handleDiabetesSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      age: parseFloat(formData.get('age')),
      bmi: parseFloat(formData.get('bmi')),
      glucose: parseFloat(formData.get('glucose')),
      familyHistory: parseInt(formData.get('familyHistory')),
      previousGD: parseInt(formData.get('previousGD')),
      pregnancyWeeks: parseFloat(formData.get('pregnancyWeeks'))
    };

    // Simulate AI prediction
    setTimeout(() => {
      const result = calculateDiabetesRisk(data);
      setDiabetesResult(result);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="predictions-page">
      
        {/* Header */}
        <div className="predictions-header">
          <div className="header-icon">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="main-title-Ai text-white-700">AI Predictions</h1>
          <p className="subtitle-Ai text-white-500  ">Advanced AI-powered health predictions for maternal care <br /> Baby Weight Prediction & Gestational Diabetes Risk Assessment</p>
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
        {/* Tab Navigation */}
        <div className="tab-navigationp">
          <div className="tab-container">
            <button 
              className={`tab-button-2 ${activeTab === 'babyWeight' ? 'active' : ''}`}
              onClick={() => setActiveTab('babyWeight')}
            >
              <Baby size={20} className="inline mr-2" /> Baby Weight Prediction
            </button>
            <button 
              className={`tab-button-2 ${activeTab === 'diabetes' ? 'active' : ''}`}
              onClick={() => setActiveTab('diabetes')}
            >
              <Stethoscope size={20} className="inline mr-2" /> Gestational Diabetes Risk
            </button>
          </div>
        </div>
        {/* Baby Weight Prediction Tab */}
        {activeTab === 'babyWeight' && (
          <div className="tab-content">
            <div className="content-grid">
              {/* Input Form */}
              <div className="prediction-card">
                <div className="card-header flex items-center gap-2">
                  <Baby size={28} className="text-blue-400" />
                  <h2 className="card-title-Ai">Baby Weight Prediction</h2>
                </div>
                <form onSubmit={handleBabyWeightSubmit} className="prediction-form">
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="gestationalAge"
                      className="form-input-Ai" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                      defaultValue={sampleBabyWeightData.gestationalAge}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Gestational Age (weeks)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="maternalAge"
                      className="form-input-Ai" 
                      placeholder=" " 
                      required 
                      defaultValue={sampleBabyWeightData.maternalAge}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Maternal Age (years)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="maternalHeight"
                      className="form-input-Ai" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                      defaultValue={sampleBabyWeightData.maternalHeight}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Maternal Height (cm)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="maternalWeight"
                      className="form-input-Ai" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                      defaultValue={sampleBabyWeightData.maternalWeight}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Pre-pregnancy Weight (kg)</label>
                  </div>
                  
                                     <div className="input-group">
                     <input 
                       type="number" 
                       name="currentWeight"
                       className="form-input-Ai" 
                       placeholder=" " 
                       step="0.1" 
                       required 
                       defaultValue={sampleBabyWeightData.currentWeight}
                       disabled={isLoading}
                     />
                     <label className="floating-label">Current Weight (kg)</label>
                   </div>
                  
                                     <div className="input-group">
                     <select name="previousBabies" className="form-input-Ai" required disabled={isLoading} defaultValue={sampleBabyWeightData.previousBabies}>
                       <option value="" disabled>Number of Previous Babies</option>
                       <option value="0">0 (First pregnancy)</option>
                       <option value="1">1</option>
                       <option value="2">2</option>
                       <option value="3">3</option>
                       <option value="4">4+</option>
                     </select>
                   </div>
                  
                  <button type="submit" className="predict-btn" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin inline mr-2" size={18} /> : <BarChart3 className="inline mr-2" size={18} />} Predict Baby Weight
                  </button>
                </form>
              </div>
              {/* Results */}
              <div className="prediction-card">
                <div className="card-header flex items-center gap-2">
                  <BarChart3 size={28} className="text-purple-400" />
                  <h3 className="card-title-Ai">Prediction Results</h3>
                </div>
                <div className="results-container">
                  {!babyWeightResult ? (
                    <div className="empty-result">
                      <p className="empty-text">Fill in the form to get your baby weight prediction</p>
                    </div>
                  ) : (
                    <div className={`result-card ${babyWeightResult.riskLevel}`}>
                      <div className="result-header flex items-center justify-center mb-2">
                        {babyWeightResult.icon}
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
                <div className="card-header flex items-center gap-2">
                  <Stethoscope size={28} className="text-blue-400" />
                  <h2 className="card-title-Ai">Gestational Diabetes Risk Assessment</h2>
                </div>
                <form onSubmit={handleDiabetesSubmit} className="prediction-form">
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="age"
                      className="form-input-Ai" 
                      placeholder=" " 
                      required 
                      defaultValue={sampleDiabetesData.age}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Age (years)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="bmi"
                      className="form-input-Ai" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                      defaultValue={sampleDiabetesData.bmi}
                      disabled={isLoading}
                    />
                    <label className="floating-label">BMI (kg/m²)</label>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="glucose"
                      className="form-input-Ai" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                      defaultValue={sampleDiabetesData.glucose}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Fasting Glucose Level (mg/dL)</label>
                  </div>
                  
                  <div className="input-group">
                    <select name="familyHistory" className="form-input-Ai" required disabled={isLoading} defaultValue={sampleDiabetesData.familyHistory}>
                      <option value="" disabled>Family History of Diabetes</option>
                      <option value="0">No family history</option>
                      <option value="1">Yes, family history</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <select name="previousGD" className="form-input-Ai" required disabled={isLoading} defaultValue={sampleDiabetesData.previousGD}>
                      <option value="" disabled>Previous Gestational Diabetes</option>
                      <option value="0">No previous GD</option>
                      <option value="1">Had GD before</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="pregnancyWeeks"
                      className="form-input-Ai" 
                      placeholder=" " 
                      step="0.1" 
                      required 
                      defaultValue={sampleDiabetesData.pregnancyWeeks}
                      disabled={isLoading}
                    />
                    <label className="floating-label">Current Pregnancy Week</label>
                  </div>
                  
                  <button type="submit" className="predict-btn" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin inline mr-2" size={18} /> : <BarChart3 className="inline mr-2" size={18} />} Assess Diabetes Risk
                  </button>
                </form>
              </div>
              {/* Results */}
              <div className="prediction-card">
                <div className="card-header flex items-center gap-2">
                  <BarChart3 size={28} className="text-purple-400" />
                  <h3 className="card-title-Ai">Risk Assessment</h3>
                </div>
                <div className="results-container">
                  {!diabetesResult ? (
                    <div className="empty-result">
                      <p className="empty-text">Complete the assessment to view your diabetes risk</p>
                    </div>
                  ) : (
                    <div className={`result-card ${diabetesResult.riskLevel.toLowerCase().replace(' ', '-')}`}> 
                      <div className="result-header flex items-center justify-center mb-2">
                        {diabetesResult.icon}
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
  );
};

export default Predictions; 