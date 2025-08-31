# MommyCare AI Integration Guide

This guide will help you set up and integrate the Python AI backend with your React frontend for baby weight prediction and diabetes risk assessment.

## 🚀 Quick Start

### 1. Setup Python AI Backend

```bash
# Navigate to the ai_backend directory
cd ai_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the AI backend server
python main.py
```

The AI backend will start on `http://localhost:8000`



### 2. Your Data is Already Ready!

The system comes with a real dataset (`babies.csv`) containing 1,238 records with the following fields:
- `case` - Case identifier
- `bwt` - Birth weight in grams
- `gestation` - Gestational age in days
- `parity` - Number of previous pregnancies (0 or 1)
- `age` - Maternal age in years
- `height` - Maternal height in cm
- `weight` - Maternal weight in kg
- `smoke` - Smoking status (0=No, 1=Yes)

### 3. Train the AI Model

The system will automatically:
1. Load the `babies.csv` file from the `uploads/` directory
2. Process and clean the data
3. Train multiple ML models and select the best one
4. Save the trained model for predictions

### 4. Test the Integration

1. Start your React frontend (if not already running)
2. Navigate to the Predictions page
3. Fill in the maternal weight and smoking status
4. Click "Predict Baby Weight"
5. The system will call the AI backend and display results

## 📁 Project Structure

```
MommyCare/
├── ai_backend/                    # Python AI Backend
│   ├── main.py                   # FastAPI server
│   ├── requirements.txt          # Python dependencies
│   ├── models/                   # ML models
│   │   ├── baby_weight_predictor.py
│   │   └── diabetes_predictor.py
│   ├── schemas/                  # Data validation
│   ├── utils/                    # Data processing
│   ├── uploads/                  # CSV files directory
│   │   └── babies.csv            # Your real dataset
│   └── models/saved/             # Trained models
├── src/mom/pages/Predictions.jsx # Updated React component
└── AI_INTEGRATION_GUIDE.md       # This guide
```

## 🔧 Configuration

### AI Backend Configuration

Create a `.env` file in the `ai_backend` directory:

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

### Frontend Configuration

Update the AI backend URL in `src/mom/pages/Predictions.jsx`:

```javascript
// Change this line to match your AI backend URL
const AI_BACKEND_URL = 'http://localhost:8000';
```

## 📊 Data Format

### Baby Weight Data Format (Your Current Dataset)

Your `babies.csv` file has these columns:

```csv
case,bwt,gestation,parity,age,height,weight,smoke
1,120,284,0,27,62,100,0
2,113,282,0,33,64,135,0
3,128,279,0,28,64,115,1
4,123,NA,0,36,69,190,0
5,108,282,0,23,67,125,1
```

**Field Descriptions:**
- `case` - Unique identifier for each record
- `bwt` - Birth weight in grams (target variable)
- `gestation` - Gestational age in days
- `parity` - Number of previous pregnancies (0=first pregnancy, 1=second or more)
- `age` - Maternal age in years
- `height` - Maternal height in centimeters
- `weight` - Maternal weight in kilograms
- `smoke` - Smoking status (0=non-smoker, 1=smoker)

### Frontend Form Fields

The React form now matches your dataset:
- **Gestational Age** - Calculated from LMP (Last Menstrual Period)
- **Maternal Age** - From user profile
- **Maternal Height** - From user profile
- **Maternal Weight** - User input (required)
- **Previous Pregnancies** - From user profile
- **Smoking Status** - User selection (required)

## 🧠 How the AI Works

### Baby Weight Prediction

1. **Data Processing**: CSV data is loaded and preprocessed
2. **Feature Engineering**: 
   - Converts gestation from days to weeks
   - Calculates BMI from height and weight
   - Handles missing values appropriately
3. **Model Training**: Multiple ML models are trained and the best one is selected
4. **Prediction**: Real-time predictions using the trained model

### Model Selection

The system automatically trains and selects the best model from:
- Random Forest
- Gradient Boosting
- XGBoost
- LightGBM

### Fallback System

If the AI backend is unavailable, the frontend falls back to local calculations to ensure the app continues working.

## 🔄 API Endpoints

### Health Check
```bash
GET http://localhost:8000/
GET http://localhost:8000/health
```

### Baby Weight Prediction
```bash
POST http://localhost:8000/predict/baby-weight
Content-Type: application/json

{
  "gestational_age": 40.0,
  "maternal_age": 28,
  "maternal_height": 165,
  "maternal_weight": 65,
  "previous_pregnancies": 0,
  "smoking_status": 0
}
```

### Diabetes Risk Assessment
```bash
POST http://localhost:8000/predict/diabetes
Content-Type: application/json

{
  "age": 30,
  "bmi": 26.5,
  "glucose": 95,
  "family_history": 0,
  "previous_gd": 0,
  "pregnancy_weeks": 24
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in ai_backend/main.py
   uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
   ```

2. **CORS Errors**
   - The backend is configured to allow requests from common frontend ports
   - If you're using a different port, update the CORS configuration in `main.py`

3. **Model Training Fails**
   - Ensure your CSV file has the correct column names
   - Check that all required columns are present
   - Verify data types (numeric values)

4. **Frontend Can't Connect**
   - Verify the AI backend is running on the correct port
   - Check the `AI_BACKEND_URL` in `Predictions.jsx`
   - Ensure no firewall is blocking the connection

### Debugging

1. **Check AI Backend Logs**
   ```bash
   # Look for detailed logs in the terminal where you started the AI backend
   ```

2. **Test API Endpoints**
   ```bash
   # Test health endpoint
   curl http://localhost:8000/health
   
   # Test prediction endpoint
   curl -X POST http://localhost:8000/predict/baby-weight \
     -H "Content-Type: application/json" \
     -d '{"gestational_age": 40, "maternal_age": 28, "maternal_height": 165, "maternal_weight": 65, "previous_pregnancies": 0, "smoking_status": 0}'
   ```

3. **Check Browser Console**
   - Open browser developer tools
   - Look for network errors or JavaScript errors

## 📈 Model Performance

### Evaluation Metrics

The system automatically evaluates models using:
- **Baby Weight**: R² score, Mean Absolute Error (MAE), Root Mean Square Error (RMSE)
- **Diabetes**: Accuracy, ROC AUC score

### Your Dataset Statistics

- **Total Records**: 1,238
- **Features**: 7 (gestation, age, height, weight, parity, smoke, BMI)
- **Target**: Birth weight in grams
- **Data Quality**: High-quality medical data with minimal missing values

### Improving Model Performance

1. **More Data**: Add more records to your CSV file
2. **Better Data Quality**: Ensure accurate measurements
3. **Feature Engineering**: The system automatically creates derived features
4. **Hyperparameter Tuning**: Models use optimized default parameters

## 🔒 Security Considerations

1. **Data Privacy**: CSV files are processed locally
2. **API Security**: Add authentication if needed
3. **Input Validation**: All inputs are validated using Pydantic schemas
4. **Error Handling**: Comprehensive error handling prevents data leaks

## 🚀 Deployment

### Local Development
```bash
# Terminal 1: Start AI Backend
cd ai_backend
python main.py

# Terminal 2: Start React Frontend
npm run dev
```

### Production Deployment

1. **AI Backend**: Deploy to cloud platform (Heroku, AWS, etc.)
2. **Frontend**: Update `AI_BACKEND_URL` to production URL
3. **CORS**: Update CORS configuration for production domain

### Docker Deployment (Optional)

```dockerfile
# Dockerfile for AI Backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

## 📝 Usage Examples

### Training with New Data

1. Add new CSV file to `ai_backend/uploads/`
2. Restart the AI backend
3. Models will be retrained automatically

### Making Predictions

1. Fill in the form in the React frontend
2. Click "Predict Baby Weight"
3. View results with confidence scores and recommendations

### Batch Processing

For multiple predictions, you can call the API directly:

```bash
# Example batch prediction
for i in {1..10}; do
  curl -X POST http://localhost:8000/predict/baby-weight \
    -H "Content-Type: application/json" \
    -d '{"gestational_age": 40, "maternal_age": 28, "maternal_height": 165, "maternal_weight": 65, "previous_pregnancies": 0, "smoking_status": 0}'
done
```

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in both frontend and backend
3. Verify your CSV data format
4. Test API endpoints directly

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Pandas Documentation](https://pandas.pydata.org/)
- [React Documentation](https://reactjs.org/)

---

**Note**: This AI system is for educational and guidance purposes only. Always consult healthcare professionals for medical decisions.
