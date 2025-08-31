# MommyCare AI Predictions Backend

A Python-based AI backend for maternal health predictions, specifically designed for baby weight prediction and gestational diabetes risk assessment.

## Features

- **Baby Weight Prediction**: ML models to predict baby birth weight based on maternal data
- **Diabetes Risk Assessment**: AI-powered gestational diabetes risk prediction
- **Excel Data Processing**: Automatic processing of Excel files for model training
- **RESTful API**: FastAPI-based endpoints for predictions
- **Model Management**: Automatic model training, saving, and loading
- **Data Validation**: Comprehensive data validation and preprocessing

## Project Structure

```
ai_backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── models/
│   ├── __init__.py
│   ├── baby_weight_predictor.py    # Baby weight prediction model
│   └── diabetes_predictor.py       # Diabetes risk prediction model
├── schemas/
│   ├── __init__.py
│   └── prediction_schemas.py       # Pydantic schemas for validation
├── utils/
│   ├── __init__.py
│   └── data_processor.py          # Excel data processing utilities
├── uploads/                        # Directory for uploaded Excel files
├── data/
│   └── processed/                  # Processed data files
└── models/
    └── saved/                      # Saved trained models
```

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### 2. Installation

```bash
# Navigate to the ai_backend directory
cd ai_backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Setup

Create a `.env` file in the ai_backend directory:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Model Configuration
MODEL_SAVE_PATH=models/saved
UPLOAD_DIR=uploads
PROCESSED_DATA_DIR=data/processed

# Logging
LOG_LEVEL=INFO
```

### 4. Running the Server

```bash
# Start the FastAPI server
python main.py

# Or using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### Predictions
- `POST /predict/baby-weight` - Baby weight prediction
- `POST /predict/diabetes` - Diabetes risk assessment

### Model Management
- `POST /train/baby-weight` - Retrain baby weight model
- `POST /upload-data` - Process uploaded training data

## Excel Data Format

### Baby Weight Data
Your Excel file should contain the following columns:

| Column Name | Description | Example |
|-------------|-------------|---------|
| gestational_age | Gestational age in weeks | 38.5 |
| maternal_age | Maternal age in years | 28 |
| maternal_height | Maternal height in cm | 165 |
| maternal_weight | Pre-pregnancy weight in kg | 65 |
| current_weight | Current weight in kg | 75 |
| previous_pregnancies | Number of previous pregnancies | 1 |
| baby_weight | Actual birth weight in grams | 3200 |

### Diabetes Data
Your Excel file should contain the following columns:

| Column Name | Description | Example |
|-------------|-------------|---------|
| age | Age in years | 30 |
| bmi | Body Mass Index | 26.5 |
| glucose | Fasting glucose level (mg/dL) | 95 |
| family_history | Family history of diabetes (0=No, 1=Yes) | 0 |
| previous_gd | Previous gestational diabetes (0=No, 1=Yes) | 0 |
| pregnancy_weeks | Current pregnancy week | 24 |
| diabetes_diagnosis | Diabetes diagnosis (0=No, 1=Yes) | 0 |

## Usage Examples

### 1. Training with Your Excel Data

1. Place your Excel file in the `uploads/` directory
2. The system will automatically detect the data type and process it
3. Models will be trained automatically on startup if no existing models are found

### 2. Making Predictions

#### Baby Weight Prediction
```bash
curl -X POST "http://localhost:8000/predict/baby-weight" \
     -H "Content-Type: application/json" \
     -d '{
       "gestational_age": 38.5,
       "maternal_age": 28,
       "maternal_height": 165,
       "maternal_weight": 65,
       "current_weight": 75,
       "previous_pregnancies": 1
     }'
```

#### Diabetes Risk Assessment
```bash
curl -X POST "http://localhost:8000/predict/diabetes" \
     -H "Content-Type: application/json" \
     -d '{
       "age": 30,
       "bmi": 26.5,
       "glucose": 95,
       "family_history": 0,
       "previous_gd": 0,
       "pregnancy_weeks": 24
     }'
```

### 3. Frontend Integration

Update your React frontend to call the AI backend:

```javascript
// In your Predictions.jsx file, update the API calls:

const handleBabyWeightSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await fetch('http://localhost:8000/predict/baby-weight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gestational_age: profileData.gestationalAge,
        maternal_age: profileData.age,
        maternal_height: profileData.height.value,
        maternal_weight: parseFloat(prePregnancyWeight),
        current_weight: profileData.weight.value,
        previous_pregnancies: profileData.medicalHistory.previousPregnancies
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      setBabyWeightResult({
        weight: result.predicted_weight,
        category: result.weight_category,
        advice: result.recommendation,
        riskLevel: result.risk_level
      });
    }
  } catch (error) {
    console.error('Prediction error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## Model Training

The system automatically trains models using:

1. **Random Forest**: Good for handling non-linear relationships
2. **Gradient Boosting**: Excellent for complex patterns
3. **XGBoost**: High-performance gradient boosting
4. **LightGBM**: Fast gradient boosting framework
5. **Logistic Regression**: For diabetes prediction

The best performing model is automatically selected and saved.

## Data Processing

The system includes comprehensive data processing:

- **Automatic column mapping**: Handles various column naming conventions
- **Missing value handling**: Imputes missing values appropriately
- **Data validation**: Ensures data quality and completeness
- **Outlier detection**: Removes statistical outliers
- **Feature engineering**: Creates derived features (BMI, weight gain, etc.)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in main.py or use a different port
2. **Missing dependencies**: Ensure all requirements are installed
3. **Excel file format**: Ensure your Excel file has the correct column names
4. **CORS errors**: The backend is configured to allow requests from common frontend ports

### Logs

Check the console output for detailed logs. The system uses structured logging to help with debugging.

## Deployment

### Local Development
```bash
python main.py
```

### Production
```bash
# Using gunicorn (install with: pip install gunicorn)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the MommyCare application.
