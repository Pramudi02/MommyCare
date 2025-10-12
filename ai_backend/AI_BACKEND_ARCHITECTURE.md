# MommyCare AI Backend Architecture & Flow

## Overview
The MommyCare AI Backend is a Python-based FastAPI application that provides machine learning predictions for maternal health. It offers two main prediction services: **Baby Weight Prediction** and **Gestational Diabetes Risk Assessment**.

## System Architecture

```
Frontend (React)
        ↓ HTTP POST
AI Backend (FastAPI)
        ↓
[Data Processing] → [Model Training] → [Prediction Engine] → [Response]
        ↓                    ↓                ↓
   [CSV Data]        [Saved Models]    [Real-time Results]
```

## Directory Structure & File Responsibilities

### Main Application Files

```
ai_backend/
├── main.py                    # FastAPI application entry point & API endpoints
├── requirements.txt           # Python dependencies
├── README.md                 # Setup and usage documentation
├── start_server.bat         # Windows batch script to start server
└── test_integration.py      # Integration testing script
```

### Core Modules

```
├── models/
│   ├── baby_weight_predictor.py    # Baby weight ML model class
│   ├── diabetes_predictor.py       # Diabetes risk ML model class
│   └── saved/                      # Directory for trained model files
│       ├── baby_weight_model.joblib
│       ├── baby_weight_model_scaler.joblib
│       ├── diabetes_model.joblib
│       └── diabetes_model_scaler.joblib
```

```
├── schemas/
│   └── prediction_schemas.py       # Pydantic models for API validation
```

```
├── utils/
│   └── data_processor.py          # Data processing and validation utilities
```

```
├── uploads/                        # Training data files
│   ├── babies.csv                 # Baby weight training data
│   └── GestationalDiabetes.csv   # Diabetes training data
```

## Data Flow: Step-by-Step Process

### 1. Application Startup Flow

```
1. main.py starts FastAPI application
2. @app.on_event("startup") triggers initialization
3. DataProcessor() → initializes data handling utility
4. BabyWeightPredictor() → loads/trains baby weight model
5. DiabetesPredictor() → loads/trains diabetes model
6. Server ready to accept requests on port 8000
```

**File: `main.py` - Startup Event**
```python
@app.on_event("startup")
async def startup_event():
    # Initialize data processor
    data_processor = DataProcessor()
    
    # Initialize baby weight predictor
    baby_weight_predictor = BabyWeightPredictor()
    await baby_weight_predictor.load_model()
    
    # Initialize diabetes predictor
    diabetes_predictor = DiabetesPredictor()
    await diabetes_predictor.load_model()
```

### 2. Model Loading/Training Flow

#### For Baby Weight Predictor (`baby_weight_predictor.py`):

```
1. load_model() called
2. Check if models/saved/baby_weight_model.joblib exists
   ├── YES: Load existing model + scaler
   └── NO: Train new model
3. If training needed:
   ├── Load babies.csv from uploads/ directory
   ├── Preprocess data (handle missing values, create features)
   ├── Train multiple models (RandomForest, XGBoost, LightGBM, etc.)
   ├── Select best performing model
   ├── Save model and scaler to models/saved/
   └── Ready for predictions
```

#### For Diabetes Predictor (`diabetes_predictor.py`):

```
1. load_model() called
2. Check if models/saved/diabetes_model.joblib exists
   ├── YES: Load existing model + scaler
   └── NO: Train new model
3. If training needed:
   ├── Load GestationalDiabetes.csv from uploads/
   ├── Preprocess data (binary classification setup)
   ├── Train multiple classifiers (RandomForest, XGBoost, LogisticRegression)
   ├── Select best performing model (highest ROC AUC)
   ├── Save model and scaler to models/saved/
   └── Ready for predictions
```

### 3. API Request Flow

#### Baby Weight Prediction (`POST /predict/baby-weight`)

```
Frontend Request:
{
  "gestational_age": 40.0,
  "maternal_age": 28,
  "maternal_height": 165,
  "maternal_weight": 65,
  "previous_pregnancies": 0,
  "smoking_status": 0
}
```

**Step-by-Step Processing:**

1. **Request Validation** (`prediction_schemas.py`):
   ```python
   # BabyWeightRequest validates input
   - gestational_age: 20-45 weeks
   - maternal_age: 13-60 years
   - maternal_height: 120-220 cm
   - maternal_weight: 30-200 kg
   - Calculates BMI validation
   ```

2. **Feature Engineering** (`baby_weight_predictor.py`):
   ```python
   input_data = {
       'gestation_weeks': request.gestational_age,
       'age': request.maternal_age,
       'height': request.maternal_height,
       'weight': request.maternal_weight,
       'parity': request.previous_pregnancies,
       'smoke': request.smoking_status,
       'bmi': weight / ((height/100) ** 2)  # Calculated BMI
   }
   ```

3. **Model Prediction**:
   ```python
   # Convert to array and scale features
   X = np.array([list(input_data.values())])
   X_scaled = self.scaler.transform(X)
   
   # Make prediction using trained model
   predicted_weight = self.model.predict(X_scaled)[0]
   ```

4. **Result Interpretation**:
   ```python
   if predicted_weight < 2500:
       weight_category = "Low Birth Weight"
       risk_level = "LOW"
   elif predicted_weight > 4000:
       weight_category = "High Birth Weight"  
       risk_level = "MEDIUM"
   else:
       weight_category = "Normal Birth Weight"
       risk_level = "NORMAL"
   ```

5. **Response Generation**:
   ```json
   {
     "success": true,
     "prediction_type": "baby_weight",
     "predicted_weight": 3250,
     "weight_category": "Normal Birth Weight",
     "risk_level": "normal",
     "recommendation": "Predicted weight is within normal range...",
     "confidence": 0.85,
     "disclaimer": "This prediction is based on statistical models...",
     "model_version": "1.0.0",
     "prediction_timestamp": "2024-01-15T10:30:00",
     "input_data": {...}
   }
   ```

#### Diabetes Risk Prediction (`POST /predict/diabetes`)

```
Frontend Request:
{
  "age": 30,
  "pregnancy_no": 1,
  "weight": 70,
  "height": 165,
  "bmi": 26.5,
  "heredity": 0
}
```

**Step-by-Step Processing:**

1. **Request Validation** (`prediction_schemas.py`):
   ```python
   # DiabetesRequest validates input
   - age: 13-60 years
   - pregnancy_no: 1-10 pregnancies
   - weight: 30-200 kg
   - height: 120-220 cm
   - bmi: 15-60 BMI
   - heredity: 0 (no) or 1 (yes) family history
   ```

2. **Feature Preparation** (`diabetes_predictor.py`):
   ```python
   input_data = {
       'Age': request.age,
       'Pregnancy No': request.pregnancy_no,
       'Weight': request.weight,
       'Height': request.height,
       'BMI': request.bmi,
       'Heredity': request.heredity
   }
   ```

3. **Risk Calculation**:
   ```python
   # Get probability of diabetes (0-1)
   risk_probability = self.model.predict_proba(X_scaled)[0][1]
   risk_score = risk_probability * 100  # Convert to percentage
   ```

4. **Risk Level Determination**:
   ```python
   if risk_score <= 30:
       risk_level = "LOW"
       risk_assessment = "Low Risk"
   elif risk_score <= 60:
       risk_level = "MEDIUM" 
       risk_assessment = "Moderate Risk"
   else:
       risk_level = "HIGH"
       risk_assessment = "High Risk"
   ```

### 4. Data Processing Flow (`data_processor.py`)

#### When New Training Data is Uploaded:

```
1. detect_data_type() - Analyze CSV columns to identify data type
2. validate_data() - Check for missing values, outliers, data quality
3. clean_data() - Remove duplicates, handle missing values, remove outliers
4. save_processed_data() - Save cleaned data with timestamp
5. Update models with new data (optional retrain)
```

#### Data Quality Assessment:
```python
quality_score = 1.0 - (missing_percentage * 0.7 + outlier_percentage * 0.3)
```

## Machine Learning Models Used

### Baby Weight Prediction Models:
- **RandomForestRegressor**: Handles non-linear relationships
- **GradientBoostingRegressor**: Complex pattern recognition
- **XGBoostRegressor**: High-performance gradient boosting
- **LightGBMRegressor**: Fast gradient boosting
- **Best model selection**: Highest R² score

### Diabetes Risk Models:
- **RandomForestClassifier**: Ensemble method for classification
- **GradientBoostingClassifier**: Advanced gradient boosting
- **XGBoostClassifier**: Optimized gradient boosting
- **LightGBMClassifier**: Efficient gradient boosting
- **LogisticRegression**: Linear probabilistic model
- **Best model selection**: Highest ROC AUC score

## API Endpoints Summary

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/` | GET | Health check | None | Status message |
| `/health` | GET | Detailed health | None | Model status |
| `/predict/baby-weight` | POST | Baby weight prediction | Maternal data | Weight prediction |
| `/predict/diabetes` | POST | Diabetes risk | Risk factors | Risk assessment |
| `/train/baby-weight` | POST | Retrain model | None | Training status |
| `/upload-data` | POST | Process new data | None | Processing status |

## Error Handling & Logging

The system uses **Loguru** for comprehensive logging:

```python
logger.info("Starting model training...")
logger.error(f"Error loading model: {e}")
logger.warning("Scaler not found, retraining model...")
```

**Error Response Format:**
```json
{
  "detail": "Error message",
  "status_code": 500
}
```

## Testing & Validation

### Integration Testing (`test_integration.py`):
1. Health check endpoint test
2. Baby weight prediction test with sample data
3. Diabetes prediction test with sample data
4. Response validation and format checking

### Model Performance Metrics:
- **Baby Weight**: R² score, MAE, RMSE
- **Diabetes Risk**: ROC AUC score, Accuracy, Classification Report

## Frontend Integration

The AI backend is designed to integrate with the React frontend through CORS-enabled API calls:

```javascript
// Example frontend integration
const response = await fetch('http://localhost:8000/predict/baby-weight', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
const result = await response.json();
```

## Production Considerations

1. **Model Versioning**: Each model saves with version info
2. **Data Backup**: Original and processed data are preserved
3. **Scalability**: FastAPI supports async operations
4. **Monitoring**: Comprehensive logging for debugging
5. **Security**: Input validation through Pydantic schemas
6. **Performance**: Model loading optimized for fast startup

## Deployment Flow

1. Install dependencies: `pip install -r requirements.txt`
2. Place training data in `uploads/` directory
3. Start server: `python main.py` or `uvicorn main:app`
4. Models train automatically on first startup
5. API ready for frontend integration

This architecture ensures reliable, scalable, and maintainable AI predictions for the MommyCare application.