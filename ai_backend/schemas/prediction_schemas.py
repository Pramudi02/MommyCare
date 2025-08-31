from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    NORMAL = "normal"

class BabyWeightRequest(BaseModel):
    """Schema for baby weight prediction request"""
    gestational_age: float = Field(..., ge=20, le=45, description="Gestational age in weeks")
    maternal_age: int = Field(..., ge=13, le=60, description="Maternal age in years")
    maternal_height: float = Field(..., ge=120, le=220, description="Maternal height in cm")
    maternal_weight: float = Field(..., ge=30, le=200, description="Maternal weight in kg")
    previous_pregnancies: int = Field(..., ge=0, le=10, description="Number of previous pregnancies (parity)")
    smoking_status: int = Field(0, ge=0, le=1, description="Smoking status (0=No, 1=Yes)")
    
    @validator('maternal_weight')
    def weight_must_be_reasonable(cls, v, values):
        """Validate that weight is reasonable compared to height"""
        if 'maternal_height' in values:
            height_m = values['maternal_height'] / 100
            bmi = v / (height_m ** 2)
            # Allow more realistic BMI range for pregnant women
            if bmi < 13 or bmi > 55:
                raise ValueError(f'Weight seems unreasonable for the given height (BMI: {bmi:.1f}). BMI should be between 13-55.')
        return v

class DiabetesRequest(BaseModel):
    """Schema for diabetes risk prediction request"""
    age: int = Field(..., ge=13, le=60, description="Age in years")
    pregnancy_no: int = Field(..., ge=1, le=10, description="Number of pregnancies")
    weight: float = Field(..., ge=30, le=200, description="Weight in kg")
    height: float = Field(..., ge=120, le=220, description="Height in cm")
    bmi: float = Field(..., ge=15, le=60, description="BMI (kg/m²)")
    heredity: int = Field(..., ge=0, le=1, description="Family history of diabetes (0=No, 1=Yes)")

class PredictionResponse(BaseModel):
    """Schema for prediction response"""
    success: bool = Field(..., description="Whether the prediction was successful")
    prediction_type: str = Field(..., description="Type of prediction (baby_weight or diabetes)")
    
    # For baby weight prediction
    predicted_weight: Optional[float] = Field(None, description="Predicted baby weight in grams")
    weight_category: Optional[str] = Field(None, description="Weight category (Low, Normal, High)")
    risk_level: Optional[RiskLevel] = Field(None, description="Risk level")
    
    # For diabetes prediction
    risk_score: Optional[float] = Field(None, ge=0, le=100, description="Diabetes risk score (0-100)")
    risk_assessment: Optional[str] = Field(None, description="Risk assessment text")
    
    # Common fields
    recommendation: str = Field(..., description="Medical recommendation")
    confidence: Optional[float] = Field(None, ge=0, le=1, description="Prediction confidence (0-1)")
    disclaimer: str = Field(..., description="Medical disclaimer")
    
    # Additional metadata
    model_version: str = Field(..., description="Model version used")
    prediction_timestamp: str = Field(..., description="Timestamp of prediction")
    input_data: Dict[str, Any] = Field(..., description="Input data used for prediction")

class ModelTrainingRequest(BaseModel):
    """Schema for model training request"""
    data_file_path: str = Field(..., description="Path to training data file")
    model_type: str = Field(..., description="Type of model to train")
    hyperparameters: Optional[Dict[str, Any]] = Field(None, description="Model hyperparameters")

class TrainingResponse(BaseModel):
    """Schema for training response"""
    success: bool = Field(..., description="Whether training was successful")
    model_accuracy: Optional[float] = Field(None, description="Model accuracy score")
    training_time: Optional[float] = Field(None, description="Training time in seconds")
    model_version: str = Field(..., description="New model version")
    message: str = Field(..., description="Training result message")

class DataUploadRequest(BaseModel):
    """Schema for data upload request"""
    file_path: str = Field(..., description="Path to uploaded data file")
    data_type: str = Field(..., description="Type of data (baby_weight, diabetes)")
    description: Optional[str] = Field(None, description="Description of the data")

class DataUploadResponse(BaseModel):
    """Schema for data upload response"""
    success: bool = Field(..., description="Whether upload was successful")
    records_processed: int = Field(..., description="Number of records processed")
    data_quality_score: Optional[float] = Field(None, description="Data quality score")
    message: str = Field(..., description="Upload result message")
