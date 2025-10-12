# MommyCare AI Backend - Quick Start & Testing Guide

## 🚀 Quick Start

### 1. Setup & Installation
```bash
# Navigate to AI backend directory
cd ai_backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### 2. Verify Server is Running
```bash
# Check basic health
curl http://localhost:8000/

# Check detailed health status
curl http://localhost:8000/health
```

## 📊 Testing the AI Backend

### 1. Using the Integration Test Script
```bash
# Run the complete test suite
python test_integration.py
```

**Expected Output:**
```
🚀 Starting AI Backend Integration Tests
==================================================
🔍 Testing health check...
✅ Health check passed
   Response: {'status': 'healthy', 'models': {'baby_weight_predictor': True, 'diabetes_predictor': True}}

🔍 Testing baby weight prediction...
✅ Baby weight prediction successful
   Predicted weight: 3250g
   Category: Normal Birth Weight
   Risk level: normal

🔍 Testing diabetes prediction...
✅ Diabetes prediction successful
   Risk score: 25.5%
   Risk assessment: Low Risk

==================================================
📊 Test Results: 3/3 tests passed
🎉 All tests passed! Your AI backend is working correctly.
```

### 2. Manual API Testing with cURL

#### Baby Weight Prediction Test
```bash
curl -X POST "http://localhost:8000/predict/baby-weight" \
     -H "Content-Type: application/json" \
     -d '{
       "gestational_age": 38.5,
       "maternal_age": 28,
       "maternal_height": 165,
       "maternal_weight": 65,
       "previous_pregnancies": 1,
       "smoking_status": 0
     }'
```

**Expected Response:**
```json
{
  "success": true,
  "prediction_type": "baby_weight",
  "predicted_weight": 3200,
  "weight_category": "Normal Birth Weight",
  "risk_level": "normal",
  "recommendation": "Predicted weight is within normal range. Continue regular check-ups.",
  "confidence": 0.85,
  "disclaimer": "This prediction is based on statistical models and should not replace professional medical advice.",
  "model_version": "1.0.0",
  "prediction_timestamp": "2024-01-15T10:30:00",
  "input_data": {
    "gestation_weeks": 38.5,
    "age": 28,
    "height": 165,
    "weight": 65,
    "parity": 1,
    "smoke": 0,
    "bmi": 23.875
  }
}
```

#### Diabetes Risk Prediction Test
```bash
curl -X POST "http://localhost:8000/predict/diabetes" \
     -H "Content-Type: application/json" \
     -d '{
       "age": 30,
       "pregnancy_no": 2,
       "weight": 75,
       "height": 165,
       "bmi": 27.5,
       "heredity": 1
     }'
```

**Expected Response:**
```json
{
  "success": true,
  "prediction_type": "diabetes",
  "risk_score": 45.2,
  "risk_assessment": "Moderate Risk",
  "risk_level": "medium",
  "recommendation": "You may have moderate risk. Consider more frequent glucose monitoring and dietary consultation.",
  "confidence": 0.80,
  "disclaimer": "This is a preliminary risk assessment tool. Only proper medical testing can definitively diagnose gestational diabetes.",
  "model_version": "1.0.0",
  "prediction_timestamp": "2024-01-15T10:30:00",
  "input_data": {
    "Age": 30,
    "Pregnancy No": 2,
    "Weight": 75,
    "Height": 165,
    "BMI": 27.5,
    "Heredity": 1
  }
}
```

### 3. Frontend Integration Testing

#### JavaScript/React Example
```javascript
// Baby Weight Prediction
const testBabyWeightPrediction = async () => {
  try {
    const response = await fetch('http://localhost:8000/predict/baby-weight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gestational_age: 40.0,
        maternal_age: 28,
        maternal_height: 165,
        maternal_weight: 65,
        previous_pregnancies: 0,
        smoking_status: 0
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Baby Weight Prediction:', result.predicted_weight + 'g');
      console.log('📊 Category:', result.weight_category);
      console.log('⚠️ Risk Level:', result.risk_level);
      console.log('💡 Recommendation:', result.recommendation);
    } else {
      console.error('❌ Prediction failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Diabetes Risk Prediction
const testDiabetesPrediction = async () => {
  try {
    const response = await fetch('http://localhost:8000/predict/diabetes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: 32,
        pregnancy_no: 2,
        weight: 70,
        height: 160,
        bmi: 27.3,
        heredity: 1
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Diabetes Risk Score:', result.risk_score + '%');
      console.log('📊 Assessment:', result.risk_assessment);
      console.log('⚠️ Risk Level:', result.risk_level);
      console.log('💡 Recommendation:', result.recommendation);
    } else {
      console.error('❌ Prediction failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Run tests
testBabyWeightPrediction();
testDiabetesPrediction();
```

## 🛠️ Troubleshooting Common Issues

### Issue 1: Server Won't Start
**Symptoms:** `ModuleNotFoundError` or dependency errors

**Solution:**
```bash
# Check Python version (should be 3.8+)
python --version

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt

# If still failing, create virtual environment
python -m venv ai_env
# Windows:
ai_env\Scripts\activate
# macOS/Linux:
source ai_env/bin/activate

pip install -r requirements.txt
python main.py
```

### Issue 2: Model Training Fails
**Symptoms:** "No training data found" or CSV loading errors

**Solution:**
1. Ensure training data files exist in `uploads/` directory:
   - `babies.csv` for baby weight model
   - `GestationalDiabetes.csv` for diabetes model

2. Check CSV format and required columns:
   ```bash
   # For baby weight data
   Required columns: case, bwt, gestation, parity, age, height, weight, smoke
   
   # For diabetes data  
   Required columns: Age, Pregnancy No, Weight, Height, BMI, Heredity, Prediction
   ```

3. If no CSV files, the system will generate sample data automatically

### Issue 3: CORS Errors from Frontend
**Symptoms:** "Access to fetch blocked by CORS policy"

**Solution:**
The backend already includes CORS configuration for common frontend ports:
```python
allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"]
```

If using a different port, update `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:YOUR_PORT"],  # Add your port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 4: Predictions Return Unrealistic Values
**Symptoms:** Baby weight < 1000g or > 6000g

**Solution:**
The system includes fallback calculations and range validation:
```python
# Baby weight is automatically clamped to 2000-5000g range
predicted_weight = max(2000, min(5000, predicted_weight))
```

Check input data validity and model training data quality.

### Issue 5: Model Loading Errors
**Symptoms:** "Model not loaded" or joblib loading errors

**Solution:**
1. Delete existing model files to force retraining:
   ```bash
   rm models/saved/*
   ```

2. Restart the server - it will automatically retrain models

3. Check file permissions in `models/saved/` directory

## 📋 API Testing Checklist

### ✅ Basic Health Checks
- [ ] GET `/` returns status message
- [ ] GET `/health` shows model status as `true`

### ✅ Baby Weight Prediction
- [ ] Valid request returns predicted weight (2000-5000g range)
- [ ] Weight category is correctly assigned (Low/Normal/High)
- [ ] Risk level matches weight category
- [ ] Recommendation text is appropriate
- [ ] Invalid inputs return validation errors

### ✅ Diabetes Risk Prediction  
- [ ] Valid request returns risk score (0-100%)
- [ ] Risk assessment matches score (Low/Medium/High)
- [ ] Risk level is correctly categorized
- [ ] Recommendation text is appropriate for risk level
- [ ] Invalid inputs return validation errors

### ✅ Error Handling
- [ ] Invalid JSON returns 422 error
- [ ] Missing required fields return validation errors
- [ ] Out-of-range values return validation errors
- [ ] Server errors return 500 with error message

### ✅ Performance
- [ ] Health check responds quickly (< 100ms)
- [ ] Predictions complete in reasonable time (< 2s)
- [ ] Concurrent requests are handled properly
- [ ] Memory usage remains stable

## 🎯 Integration with React Frontend

To integrate with your React MommyCare frontend:

1. **Update API Base URL** in your frontend configuration:
   ```javascript
   const AI_BACKEND_URL = 'http://localhost:8000';
   ```

2. **Update Prediction Functions** in your components:
   ```javascript
   // In your Predictions.jsx or similar component
   const handleBabyWeightSubmit = async (formData) => {
     const response = await fetch(`${AI_BACKEND_URL}/predict/baby-weight`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     });
     const result = await response.json();
     // Update your state with result
   };
   ```

3. **Handle Loading States** and error responses appropriately

4. **Test End-to-End** by running both frontend and backend simultaneously

## 📈 Monitoring & Logs

The AI backend uses Loguru for comprehensive logging. Monitor logs for:

- **Startup Messages**: Model loading and training status
- **Prediction Requests**: Input validation and processing
- **Error Messages**: Failed predictions or data issues
- **Performance Metrics**: Response times and model accuracy

Log levels: `INFO`, `WARNING`, `ERROR` - adjust in main.py if needed.

This guide should help you thoroughly understand, test, and integrate the MommyCare AI Backend!