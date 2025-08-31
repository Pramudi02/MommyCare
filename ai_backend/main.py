from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from loguru import logger
import os
from dotenv import load_dotenv

# Import our modules
from models.baby_weight_predictor import BabyWeightPredictor
from models.diabetes_predictor import DiabetesPredictor
from utils.data_processor import DataProcessor
from schemas.prediction_schemas import BabyWeightRequest, DiabetesRequest, PredictionResponse

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="MommyCare AI Predictions API",
    description="AI-powered predictions for maternal health and baby weight",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
baby_weight_predictor = None
diabetes_predictor = None
data_processor = None

@app.on_event("startup")
async def startup_event():
    """Initialize models and data processor on startup"""
    global baby_weight_predictor, diabetes_predictor, data_processor
    
    try:
        logger.info("Initializing AI models...")
        
        # Initialize data processor
        data_processor = DataProcessor()
        
        # Initialize baby weight predictor
        baby_weight_predictor = BabyWeightPredictor()
        await baby_weight_predictor.load_model()
        
        # Initialize diabetes predictor
        diabetes_predictor = DiabetesPredictor()
        await diabetes_predictor.load_model()
        
        logger.info("AI models initialized successfully!")
        
    except Exception as e:
        logger.error(f"Error initializing models: {e}")
        raise e

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "MommyCare AI Predictions API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models": {
            "baby_weight_predictor": baby_weight_predictor is not None,
            "diabetes_predictor": diabetes_predictor is not None
        }
    }

@app.post("/predict/baby-weight", response_model=PredictionResponse)
async def predict_baby_weight(request: BabyWeightRequest):
    """Predict baby weight based on maternal data"""
    try:
        logger.info(f"Received baby weight prediction request: {request}")
        
        # Validate input data
        if not baby_weight_predictor:
            raise HTTPException(status_code=503, detail="Baby weight predictor not initialized")
        
        # Make prediction
        prediction = await baby_weight_predictor.predict(request)
        
        logger.info(f"Baby weight prediction completed: {prediction}")
        return prediction
        
    except Exception as e:
        logger.error(f"Error in baby weight prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/diabetes", response_model=PredictionResponse)
async def predict_diabetes(request: DiabetesRequest):
    """Predict gestational diabetes risk"""
    try:
        logger.info(f"Received diabetes prediction request: {request}")
        
        # Validate input data
        if not diabetes_predictor:
            raise HTTPException(status_code=503, detail="Diabetes predictor not initialized")
        
        # Make prediction
        prediction = await diabetes_predictor.predict(request)
        
        logger.info(f"Diabetes prediction completed: {prediction}")
        return prediction
        
    except Exception as e:
        logger.error(f"Error in diabetes prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train/baby-weight")
async def train_baby_weight_model():
    """Retrain baby weight model with new data"""
    try:
        logger.info("Starting baby weight model training...")
        
        # Train the model
        await baby_weight_predictor.train_model()
        
        logger.info("Baby weight model training completed!")
        return {"message": "Model training completed successfully"}
        
    except Exception as e:
        logger.error(f"Error in model training: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-data")
async def upload_training_data():
    """Upload new training data"""
    try:
        logger.info("Processing uploaded training data...")
        
        # Process the uploaded data
        await data_processor.process_new_data()
        
        logger.info("Training data processed successfully!")
        return {"message": "Training data processed successfully"}
        
    except Exception as e:
        logger.error(f"Error processing training data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
