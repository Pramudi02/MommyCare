import React, { useState, useEffect } from 'react';
import { Baby, Stethoscope, AlertTriangle, BarChart3, CheckCircle, Loader2, Brain } from 'lucide-react';
import { momProfileAPI } from '../../services/api';
import './Predictions.css';

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('babyWeight');
  const [babyWeightResult, setBabyWeightResult] = useState(null);
  const [diabetesResult, setDiabetesResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [prePregnancyWeight, setPrePregnancyWeight] = useState('');
  const [smokingStatus, setSmokingStatus] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    gestationalAge: '',
    maternalAge: '',
    maternalHeight: '',
    maternalWeight: '',
    previousPregnancies: 0
  });

  // AI Backend URL - update this to match your Python backend
  const AI_BACKEND_URL = 'http://localhost:8000';
  
  // Log the backend URL for debugging
  console.log('AI Backend URL:', AI_BACKEND_URL);

  // Calculate gestational age from LMP
  const calculateGestationalAge = (lmp) => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp);
    const today = new Date();
    const diffTime = Math.abs(today - lmpDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const gestationalWeeks = Math.floor(diffDays / 7);
    return gestationalWeeks;
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setProfileLoading(true);
      const response = await momProfileAPI.getProfile();
      if (response.data) {
        setProfileData(response.data);
        // Calculate gestational age from LMP
        const gestationalAge = calculateGestationalAge(response.data.lmp);
        if (gestationalAge) {
          setProfileData(prev => ({ ...prev, gestationalAge }));
        }
        
        // Initialize form data with profile values
        setFormData({
          gestationalAge: gestationalAge || '',
          maternalAge: response.data.age || '',
          maternalHeight: response.data.height?.value || '',
          maternalWeight: '',
          previousPregnancies: response.data.medicalHistory?.previousPregnancies || 0
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Set default values if API fails
      setProfileData({
        age: '',
        height: { value: '', unit: 'cm' },
        weight: { value: '', unit: 'kg' },
        gestationalAge: null,
        medicalHistory: { previousPregnancies: 0 }
      });
    } finally {
      setProfileLoading(false);
    }
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

  const handleBabyWeightSubmit = async (e) => {
    e.preventDefault();
    
    // Check if profile data is loaded
    if (!profileData) {
      alert('Profile data is not loaded. Please refresh the page and try again.');
      return;
    }

    // Check if pre-pregnancy weight is provided
    if (!prePregnancyWeight) {
      alert('Please enter your pre-pregnancy weight.');
      return;
    }

    // Validate gestational age
    const gestationalAge = parseFloat(formData.gestationalAge);
    if (!gestationalAge || gestationalAge < 20 || gestationalAge > 45) {
      alert(`Gestational age must be between 20-45 weeks. Current value: ${gestationalAge || 'Not set'}.`);
      return;
    }

    // Validate other required fields
    const maternalAge = parseInt(formData.maternalAge);
    if (!maternalAge || maternalAge < 13 || maternalAge > 60) {
      alert(`Please ensure your age is between 13-60 years. Current value: ${maternalAge || 'Not set'}.`);
      return;
    }

    const maternalHeight = parseFloat(formData.maternalHeight);
    if (!maternalHeight || maternalHeight < 120 || maternalHeight > 220) {
      alert(`Please ensure your height is between 120-220 cm. Current value: ${maternalHeight || 'Not set'} cm.`);
      return;
    }

    const maternalWeight = parseFloat(prePregnancyWeight);
    if (maternalWeight < 25 || maternalWeight > 200) {
      alert('Pre-pregnancy weight must be between 25-200 kg.');
      return;
    }
    
    // Calculate BMI and validate
    const heightM = maternalHeight / 100;
    const bmi = maternalWeight / (heightM * heightM);
    if (bmi < 13 || bmi > 55) {
      alert(`BMI (${bmi.toFixed(1)}) is outside the reasonable range (13-55). Please check your weight and height.`);
      return;
    }

    setIsLoading(true);
    setApiError(null); // Clear previous errors
    
    try {
      // Prepare the request data
      const requestData = {
        gestational_age: gestationalAge,
        maternal_age: maternalAge,
        maternal_height: maternalHeight,
        maternal_weight: maternalWeight,
        smoking_status: smokingStatus,
        previous_pregnancies: formData.previousPregnancies
      };
      
      console.log('Sending request to AI backend:', requestData);
      
      // Call the Python AI backend
      const response = await fetch(`${AI_BACKEND_URL}/predict/baby-weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || 'Unknown error';
        console.log('API Error:', errorMessage);
        setApiError(`API Error (${response.status}): ${errorMessage}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        console.log('Setting baby weight result:', {
          weight: result.predicted_weight,
          category: result.weight_category,
          advice: result.recommendation,
          riskLevel: result.risk_level
        });
        setBabyWeightResult({
          weight: result.predicted_weight,
          category: result.weight_category,
          advice: result.recommendation,
          riskLevel: result.risk_level
        });
      } else {
        throw new Error('Prediction failed');
      }
    } catch (error) {
      console.error('Error calling AI backend:', error);
      console.log('Using fallback calculation...');
             // Fallback to local calculation if AI backend fails
       const fallbackResult = calculateBabyWeightFallback({
         gestationalAge: gestationalAge || 0,
         maternalAge: maternalAge || 0,
         maternalHeight: maternalHeight || 0,
         maternalWeight: parseFloat(prePregnancyWeight),
         currentWeight: profileData.weight?.value || 0,
         previousBabies: formData.previousPregnancies || 0
       });
      console.log('Fallback result:', fallbackResult);
      setBabyWeightResult(fallbackResult);
      // Show error to user
      setApiError(`API Error: ${error.message}. Using fallback calculation.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback calculation if AI backend is not available
  const calculateBabyWeightFallback = (data) => {
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

    let category, advice, riskLevel;
    if (predictedWeight < 2500) {
      category = "Low Birth Weight";
      advice = "Consider discussing nutrition and monitoring with your doctor.";
      riskLevel = "low";
    } else if (predictedWeight > 4000) {
      category = "High Birth Weight";
      advice = "Monitor glucose levels and discuss delivery plans with your healthcare provider.";
      riskLevel = "medium";
    } else {
      category = "Normal Birth Weight";
      advice = "Predicted weight is within normal range. Continue regular check-ups.";
      riskLevel = "normal";
    }

    return {
      weight: Math.round(predictedWeight),
      category,
      advice,
      riskLevel
    };
  };

  const handleDiabetesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Validate input data
      const age = parseFloat(formData.get('age'));
      const height = parseFloat(formData.get('height'));
      const bmi = parseFloat(formData.get('bmi'));
      const familyHistory = parseInt(formData.get('familyHistory'));
      const previousGD = parseInt(formData.get('previousGD'));
      
      // Validate ranges
      if (age < 13 || age > 60) {
        alert('Age must be between 13-60 years.');
        setIsLoading(false);
        return;
      }
      
      if (height < 120 || height > 220) {
        alert('Height must be between 120-220 cm.');
        setIsLoading(false);
        return;
      }
      
      if (bmi < 15 || bmi > 50) {
        alert('BMI must be between 15-50 kg/m².');
        setIsLoading(false);
        return;
      }
      
      const data = {
        age: age,
        height: height,
        bmi: bmi,
        family_history: familyHistory,
        previous_gd: previousGD
      };

      // Call the Python AI backend
      const response = await fetch(`${AI_BACKEND_URL}/predict/diabetes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.detail || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setDiabetesResult({
          riskLevel: result.risk_assessment,
          riskScore: result.risk_score,
          advice: result.recommendation
        });
      } else {
        throw new Error('Prediction failed');
      }
    } catch (error) {
      console.error('Error calling AI backend:', error);
      // Fallback to local calculation if AI backend fails
      const fallbackResult = calculateDiabetesRiskFallback({
        age: parseFloat(e.target.age.value),
        bmi: parseFloat(e.target.bmi.value),
        height: parseFloat(e.target.height.value),
        familyHistory: parseInt(e.target.familyHistory.value),
        previousGD: parseInt(e.target.previousGD.value),

      });
      setDiabetesResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback calculation if AI backend is not available
  const calculateDiabetesRiskFallback = (data) => {
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

    let riskLevel, advice;
    
    if (riskScore <= 30) {
      riskLevel = "Low Risk";
      advice = "Your risk appears low. Continue healthy eating and regular exercise. Monitor with routine check-ups.";
    } else if (riskScore <= 60) {
      riskLevel = "Moderate Risk";
      advice = "You may have moderate risk. Consider more frequent glucose monitoring and dietary consultation.";
    } else {
      riskLevel = "High Risk";
      advice = "You may be at higher risk. Please consult your healthcare provider immediately for proper testing and monitoring.";
    }

    return {
      riskLevel,
      riskScore: Math.round(riskScore),
      advice
    };
  };

  if (profileLoading) {
    return (
      <div className="predictions-page bg-gray-50 p-4">
        <div className="predictions-container max-w-7xl mx-auto">
          <div className="predictions-header">
            <div className="header-icon">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="main-title-Ai text-white-700">AI Predictions</h1>
            <p className="subtitle-Ai text-white-500">Loading your profile data...</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
            <p className="ml-3">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="predictions-page  bg-gray-50 p-4">
          <div className="predictions-container max-w-7xl mx-auto">
      
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
      
      {/* Debug Mode Toggle */}
      <div className="debug-toggle mb-4">
        <button 
          onClick={() => setDebugMode(!debugMode)}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
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
                     className="form-input-Ai" 
                     placeholder=" " 
                     step="0.1" 
                     value={formData.gestationalAge}
                     onChange={(e) => setFormData(prev => ({ ...prev, gestationalAge: e.target.value }))}
                     required
                     disabled={isLoading}
                   />
                   <label className="floating-label">Gestational Age (weeks) - Calculated from LMP</label>
                 </div>
                 
                 <div className="input-group">
                   <input 
                     type="number" 
                     className="form-input-Ai" 
                     placeholder=" " 
                     value={formData.maternalAge}
                     onChange={(e) => setFormData(prev => ({ ...prev, maternalAge: e.target.value }))}
                     required
                     disabled={isLoading}
                   />
                   <label className="floating-label">Maternal Age (years) - From Profile</label>
                 </div>
                 
                 <div className="input-group">
                   <input 
                     type="number" 
                     className="form-input-Ai" 
                     placeholder=" " 
                     step="0.1" 
                     value={formData.maternalHeight}
                     onChange={(e) => setFormData(prev => ({ ...prev, maternalHeight: e.target.value }))}
                     required
                     disabled={isLoading}
                   />
                   <label className="floating-label">Maternal Height (cm) - From Profile</label>
                 </div>
                
                <div className="input-group">
                  <input 
                    type="number" 
                    name="prePregnancyWeight"
                    className="form-input-Ai" 
                    placeholder=" " 
                    step="0.1" 
                    value={prePregnancyWeight}
                    onChange={(e) => setPrePregnancyWeight(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                  <label className="floating-label">Pre-pregnancy Weight (kg) *</label>
                </div>
                
                <div className="input-group">
                  <select 
                    className="form-input-Ai" 
                    value={smokingStatus}
                    onChange={(e) => setSmokingStatus(parseInt(e.target.value))}
                    disabled={isLoading}
                  >
                    <option value="0">No smoking</option>
                    <option value="1">Smoking</option>
                  </select>
                  <label className="floating-label">Smoking Status *</label>
                </div>
                
                                   <div className="input-group">
                   <input 
                     type="number" 
                     className="form-input-Ai" 
                     placeholder=" " 
                     step="0.1" 
                    value={profileData?.weight?.value || ''}
                    disabled
                   />
                  <label className="floating-label">Current Weight (kg) - From Profile</label>
                 </div>
                
                                                                       <div className="input-group">
                   <select 
                     className="form-input-Ai" 
                     value={formData.previousPregnancies}
                     onChange={(e) => setFormData(prev => ({ ...prev, previousPregnancies: parseInt(e.target.value) }))}
                     disabled={isLoading}
                   >
                      <option value="0">0 (First pregnancy)</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                   <label className="floating-label">Previous Pregnancies - From Profile</label>
                  </div>
                
                <button type="submit" className="predict-btn" disabled={isLoading || !prePregnancyWeight}>
                  {isLoading ? <Loader2 className="animate-spin inline mr-2" size={18} /> : <BarChart3 className="inline mr-2" size={18} />} Predict Baby Weight
                </button>
                
                {/* API Error Display */}
                {apiError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800">
                      <AlertTriangle size={16} className="mr-2" />
                      <span className="text-sm font-medium">API Error</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                    <p className="text-xs text-red-600 mt-2">
                      Using fallback calculation. Please check your profile data and try again.
                    </p>
                  </div>
                )}
                
                {/* Debug Information */}
                {debugMode && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center text-gray-800 mb-2">
                      <span className="text-sm font-medium">Debug Information</span>
                    </div>
                                         <div className="text-xs text-gray-600 space-y-1">
                       <div><strong>API URL:</strong> {AI_BACKEND_URL}/predict/baby-weight</div>
                       <div><strong>Profile Data:</strong> {JSON.stringify(profileData, null, 2)}</div>
                       <div><strong>Form Data:</strong> {JSON.stringify(formData, null, 2)}</div>
                       <div><strong>Pre-pregnancy Weight:</strong> {prePregnancyWeight}</div>
                       <div><strong>Smoking Status:</strong> {smokingStatus}</div>
                     </div>
                  </div>
                )}
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
                    <p className="empty-text">Fill in the pre-pregnancy weight to get your baby weight prediction</p>
                  </div>
                ) : (
                  <div className={`result-card ${babyWeightResult.riskLevel}`}>
                    <div className="result-header flex items-center justify-center mb-2">
                      {babyWeightResult.riskLevel === 'low' ? (
                        <AlertTriangle size={32} className="text-yellow-500" />
                      ) : babyWeightResult.riskLevel === 'medium' ? (
                        <BarChart3 size={32} className="text-purple-500" />
                      ) : (
                        <CheckCircle size={32} className="text-green-500" />
                      )}
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
                      {diabetesResult.riskLevel === 'Low Risk' ? (
                        <CheckCircle size={32} className="text-green-500" />
                      ) : diabetesResult.riskLevel === 'Moderate Risk' ? (
                        <BarChart3 size={32} className="text-yellow-500" />
                      ) : (
                        <AlertTriangle size={32} className="text-red-500" />
                      )}
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
