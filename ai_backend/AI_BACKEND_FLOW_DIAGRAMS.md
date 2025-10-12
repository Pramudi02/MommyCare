# MommyCare AI Backend - Visual Flow Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MommyCare AI Backend System                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   React App     │    │   FastAPI       │    │   ML Models     │          │
│  │   (Frontend)    │───▶│   (Backend)     │───▶│   (Predictions) │          │
│  │                 │    │                 │    │                 │          │
│  │ • Baby Weight   │    │ • REST APIs     │    │ • Baby Weight   │          │
│  │   Prediction    │    │ • Data Validation│   │   Regressor     │          │
│  │ • Diabetes      │    │ • Model Loading │    │ • Diabetes      │          │
│  │   Risk Form     │    │ • Error Handling│    │   Classifier    │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
│           │                       │                       │                  │
│           │                       ▼                       │                  │
│           │              ┌─────────────────┐             │                  │
│           │              │  Data Processor │             │                  │
│           │              │                 │             │                  │
│           │              │ • CSV Loading   │             │                  │
│           │              │ • Data Cleaning │             │                  │
│           │              │ • Validation    │             │                  │
│           │              │ • Quality Score │             │                  │
│           │              └─────────────────┘             │                  │
│           │                       │                       │                  │
│           └───────────────────────┼───────────────────────┘                  │
│                                   ▼                                          │
│                          ┌─────────────────┐                                │
│                          │  Training Data  │                                │
│                          │                 │                                │
│                          │ • babies.csv    │                                │
│                          │ • diabetes.csv  │                                │
│                          │ • Processed     │                                │
│                          │   Data Storage  │                                │
│                          └─────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Application Startup Flow

```
Start Application (main.py)
         │
         ▼
Initialize FastAPI App
         │
         ▼
Configure CORS Middleware
         │
         ▼
@app.on_event("startup")
         │
         ├─── Initialize DataProcessor()
         │              │
         │              ▼
         │    Create upload/ and data/processed/ directories
         │
         ├─── Initialize BabyWeightPredictor()
         │              │
         │              ├─── Check if baby_weight_model.joblib exists
         │              │         │
         │              │         ├─── YES: Load existing model & scaler
         │              │         │
         │              │         └─── NO: Train new model
         │              │                    │
         │              │                    ├─── Load babies.csv
         │              │                    ├─── Preprocess data
         │              │                    ├─── Train models (RF, XGB, LGB)
         │              │                    ├─── Select best model (R² score)
         │              │                    └─── Save model & scaler
         │              │
         │              └─── Model Ready
         │
         └─── Initialize DiabetesPredictor()
                        │
                        ├─── Check if diabetes_model.joblib exists
                        │         │
                        │         ├─── YES: Load existing model & scaler
                        │         │
                        │         └─── NO: Train new model
                        │                    │
                        │                    ├─── Load GestationalDiabetes.csv
                        │                    ├─── Preprocess data
                        │                    ├─── Train classifiers (RF, XGB, LR)
                        │                    ├─── Select best model (ROC AUC)
                        │                    └─── Save model & scaler
                        │
                        └─── Model Ready
                        
Server Ready on Port 8000
```

## 3. Baby Weight Prediction Flow

```
Frontend Request
       │
       ▼
POST /predict/baby-weight
{
  "gestational_age": 40.0,
  "maternal_age": 28,
  "maternal_height": 165,
  "maternal_weight": 65,
  "previous_pregnancies": 0,
  "smoking_status": 0
}
       │
       ▼
Request Validation (Pydantic)
       │
       ├─── gestational_age: 20-45 weeks ✓
       ├─── maternal_age: 13-60 years ✓
       ├─── maternal_height: 120-220 cm ✓
       ├─── maternal_weight: 30-200 kg ✓
       ├─── BMI validation ✓
       └─── previous_pregnancies: 0-10 ✓
       │
       ▼
Feature Engineering
       │
       ├─── Calculate BMI = weight / (height/100)²
       ├─── Prepare input array:
       │    [gestation_weeks, age, height, weight, parity, smoke, bmi]
       └─── Scale features using saved scaler
       │
       ▼
Model Prediction
       │
       ├─── X_scaled = scaler.transform(input_array)
       ├─── predicted_weight = model.predict(X_scaled)[0]
       └─── Validate prediction range (2000-5000g)
       │
       ▼
Result Interpretation
       │
       ├─── IF predicted_weight < 2500g
       │    │    weight_category = "Low Birth Weight"
       │    │    risk_level = "LOW"
       │    │    recommendation = "Consider nutrition monitoring..."
       │    │
       ├─── ELIF predicted_weight > 4000g
       │    │    weight_category = "High Birth Weight"
       │    │    risk_level = "MEDIUM"
       │    │    recommendation = "Monitor glucose levels..."
       │    │
       └─── ELSE
            │    weight_category = "Normal Birth Weight"
            │    risk_level = "NORMAL"
            │    recommendation = "Continue regular check-ups..."
       │
       ▼
Response Generation
{
  "success": true,
  "prediction_type": "baby_weight",
  "predicted_weight": 3250,
  "weight_category": "Normal Birth Weight",
  "risk_level": "normal",
  "recommendation": "...",
  "confidence": 0.85,
  "disclaimer": "...",
  "model_version": "1.0.0",
  "prediction_timestamp": "2024-01-15T10:30:00",
  "input_data": {...}
}
       │
       ▼
Send Response to Frontend
```

## 4. Diabetes Risk Prediction Flow

```
Frontend Request
       │
       ▼
POST /predict/diabetes
{
  "age": 30,
  "pregnancy_no": 1,
  "weight": 70,
  "height": 165,
  "bmi": 26.5,
  "heredity": 0
}
       │
       ▼
Request Validation (Pydantic)
       │
       ├─── age: 13-60 years ✓
       ├─── pregnancy_no: 1-10 ✓
       ├─── weight: 30-200 kg ✓
       ├─── height: 120-220 cm ✓
       ├─── bmi: 15-60 ✓
       └─── heredity: 0 or 1 ✓
       │
       ▼
Feature Preparation
       │
       ├─── Prepare input array:
       │    [Age, Pregnancy No, Weight, Height, BMI, Heredity]
       └─── Scale features using saved scaler
       │
       ▼
Risk Calculation
       │
       ├─── X_scaled = scaler.transform(input_array)
       ├─── risk_probability = model.predict_proba(X_scaled)[0][1]
       └─── risk_score = risk_probability * 100
       │
       ▼
Risk Level Determination
       │
       ├─── IF risk_score <= 30%
       │    │    risk_level = "LOW"
       │    │    risk_assessment = "Low Risk"
       │    │    recommendation = "Continue healthy eating..."
       │    │
       ├─── ELIF risk_score <= 60%
       │    │    risk_level = "MEDIUM"
       │    │    risk_assessment = "Moderate Risk"
       │    │    recommendation = "Consider frequent monitoring..."
       │    │
       └─── ELSE
            │    risk_level = "HIGH"
            │    risk_assessment = "High Risk"
            │    recommendation = "Consult healthcare provider..."
       │
       ▼
Response Generation
{
  "success": true,
  "prediction_type": "diabetes",
  "risk_score": 25.5,
  "risk_assessment": "Low Risk",
  "risk_level": "low",
  "recommendation": "...",
  "confidence": 0.80,
  "disclaimer": "...",
  "model_version": "1.0.0",
  "prediction_timestamp": "2024-01-15T10:30:00",
  "input_data": {...}
}
       │
       ▼
Send Response to Frontend
```

## 5. Data Processing Flow

```
New Training Data Upload
         │
         ▼
DataProcessor.process_new_data()
         │
         ├─── Scan uploads/ directory
         ├─── For each CSV/Excel file:
         │              │
         │              ▼
         │    detect_data_type()
         │              │
         │              ├─── Check column names
         │              ├─── IF has [case, bwt, gestation...] → "baby_weight"
         │              ├─── IF has [age, bmi, glucose...] → "diabetes"
         │              └─── ELSE → "unknown"
         │              │
         │              ▼
         │    validate_data()
         │              │
         │              ├─── Count missing values
         │              ├─── Check data types
         │              ├─── Detect outliers (IQR method)
         │              └─── Calculate quality score
         │              │
         │              ▼
         │    clean_data()
         │              │
         │              ├─── Remove duplicates
         │              ├─── Handle missing values
         │              │    ├─── Drop critical missing columns
         │              │    └─── Fill non-critical with defaults
         │              ├─── Remove outliers
         │              └─── Validate ranges
         │              │
         │              ▼
         │    save_processed_data()
         │              │
         │              ├─── Add timestamp to filename
         │              ├─── Save to data/processed/
         │              └─── Move original to processed/
         │
         └─── Return processing results
                        │
                        ├─── filename
                        ├─── data_type
                        ├─── original_records count
                        ├─── processed_records count
                        ├─── quality_score
                        └─── validation_results
```

## 6. Model Training Flow

```
Model Training Request
         │
         ▼
Load Training Data
         │
         ├─── Load CSV file (babies.csv or GestationalDiabetes.csv)
         ├─── OR Generate sample data if no file exists
         └─── Log data shape and columns
         │
         ▼
Data Preprocessing
         │
         ├─── Handle missing values
         ├─── Validate required columns
         ├─── Convert to numeric types
         ├─── Add derived features (BMI, gestation_weeks)
         └─── Remove invalid rows
         │
         ▼
Feature Preparation
         │
         ├─── Separate features (X) and target (y)
         ├─── Train/test split (80/20)
         └─── Scale features using StandardScaler
         │
         ▼
Model Training & Selection
         │
         ├─── Train Multiple Models:
         │    ├─── RandomForest
         │    ├─── GradientBoosting
         │    ├─── XGBoost
         │    ├─── LightGBM
         │    └─── (+ LogisticRegression for diabetes)
         │
         ├─── Evaluate Each Model:
         │    ├─── Baby Weight: R² score
         │    └─── Diabetes: ROC AUC score
         │
         └─── Select Best Performing Model
         │
         ▼
Model Persistence
         │
         ├─── Save best model to models/saved/
         ├─── Save fitted scaler
         ├─── Log training results
         └─── Model ready for predictions
```

## 7. Error Handling Flow

```
API Request
     │
     ▼
Try Block
     │
     ├─── Request Validation
     │         │
     │         ├─── Pydantic Schema Validation
     │         └─── Custom Business Rules
     │
     ├─── Model Loading Check
     │         │
     │         └─── IF model is None → HTTP 503 Error
     │
     ├─── Prediction Processing
     │         │
     │         ├─── Feature Engineering
     │         ├─── Model Prediction
     │         └─── Result Interpretation
     │
     └─── Response Generation
           │
           └─── Return Success Response
           
     │
     ▼
Exception Handling
     │
     ├─── Log Error Details (Loguru)
     ├─── Generate User-Friendly Error Message
     └─── Return HTTP Error Response
           │
           └─── HTTPException(status_code, detail)
```

This visual documentation provides a comprehensive understanding of how each component interacts and processes data through the MommyCare AI Backend system.