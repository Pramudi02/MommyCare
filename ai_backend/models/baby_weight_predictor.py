import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from datetime import datetime
from loguru import logger
from typing import Dict, Any, Optional
import xgboost as xgb
import lightgbm as lgb

from schemas.prediction_schemas import BabyWeightRequest, PredictionResponse, RiskLevel

class BabyWeightPredictor:
    def __init__(self, model_path: str = "models/saved/baby_weight_model.joblib"):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()
        self.model_version = "1.0.0"
        self.feature_names = [
            'gestation', 'age', 'height', 'weight', 'parity', 'smoke'
        ]
        
    async def load_model(self):
        """Load the trained model from disk"""
        try:
            if os.path.exists(self.model_path):
                logger.info(f"Loading existing model from {self.model_path}")
                self.model = joblib.load(self.model_path)
                
                # Load the fitted scaler
                scaler_path = self.model_path.replace('.joblib', '_scaler.joblib')
                if os.path.exists(scaler_path):
                    logger.info(f"Loading fitted scaler from {scaler_path}")
                    self.scaler = joblib.load(scaler_path)
                else:
                    logger.warning("Scaler not found, retraining model...")
                    await self.train_model()
            else:
                logger.warning("No existing model found. Training new model...")
                await self.train_model()
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            await self.train_model()
    
    def load_csv_data(self, file_path: str) -> pd.DataFrame:
        """Load baby weight data from CSV file"""
        try:
            logger.info(f"Loading data from CSV file: {file_path}")
            
            # Load the CSV file
            df = pd.read_csv(file_path)
            
            logger.info(f"Loaded {len(df)} records from CSV file")
            logger.info(f"Columns: {df.columns.tolist()}")
            
            return df
            
        except Exception as e:
            logger.error(f"Error loading CSV data: {e}")
            raise e
    
    def preprocess_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess the data for training"""
        try:
            logger.info("Preprocessing data...")
            
            # Create a copy to avoid modifying original data
            processed_df = df.copy()
            
            # Handle missing values
            processed_df = processed_df.dropna()
            
            # Ensure all required columns exist
            required_columns = [
                'case', 'bwt', 'gestation', 'parity', 'age', 'height', 'weight', 'smoke'
            ]
            
            # Check if we have the required columns
            missing_columns = [col for col in required_columns if col not in processed_df.columns]
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Convert to numeric and handle any conversion errors
            for col in required_columns:
                processed_df[col] = pd.to_numeric(processed_df[col], errors='coerce')
            
            # Remove rows with invalid data
            processed_df = processed_df.dropna()
            
            # Add derived features
            processed_df['bmi'] = processed_df['weight'] / ((processed_df['height'] / 100) ** 2)
            
            # Convert gestation from days to weeks
            processed_df['gestation_weeks'] = processed_df['gestation'] / 7
            
            logger.info(f"Preprocessed data shape: {processed_df.shape}")
            return processed_df
            
        except Exception as e:
            logger.error(f"Error preprocessing data: {e}")
            raise e
    
    async def train_model(self, data_file_path: Optional[str] = None):
        """Train the baby weight prediction model"""
        try:
            logger.info("Starting model training...")
            
            # Load data
            if data_file_path:
                df = self.load_csv_data(data_file_path)
            else:
                # Use the babies.csv file in uploads directory
                upload_path = "uploads/babies.csv"
                if os.path.exists(upload_path):
                    df = self.load_csv_data(upload_path)
                else:
                    # Use sample data if no file provided
                    df = self.generate_sample_data()
            
            # Preprocess data
            processed_df = self.preprocess_data(df)
            
            # Prepare features and target
            X = processed_df[['gestation_weeks', 'age', 'height', 'weight', 'parity', 'smoke', 'bmi']]
            y = processed_df['bwt']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train multiple models and select the best one
            models = {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingRegressor(random_state=42),
                'xgboost': xgb.XGBRegressor(random_state=42),
                'lightgbm': lgb.LGBMRegressor(random_state=42)
            }
            
            best_model = None
            best_score = -np.inf
            
            for name, model in models.items():
                logger.info(f"Training {name}...")
                model.fit(X_train_scaled, y_train)
                
                # Evaluate model
                y_pred = model.predict(X_test_scaled)
                score = r2_score(y_test, y_pred)
                
                logger.info(f"{name} R² score: {score:.4f}")
                
                if score > best_score:
                    best_score = score
                    best_model = model
            
            self.model = best_model
            
            # Save the model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            
            # Save scaler
            scaler_path = self.model_path.replace('.joblib', '_scaler.joblib')
            joblib.dump(self.scaler, scaler_path)
            
            logger.info(f"Model training completed. Best R² score: {best_score:.4f}")
            logger.info(f"Model saved to {self.model_path}")
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise e
    
    def generate_sample_data(self) -> pd.DataFrame:
        """Generate sample data for training if no CSV file is available"""
        logger.info("Generating sample training data...")
        
        np.random.seed(42)
        n_samples = 2000  # Increased sample size
        
        data = {
            'case': range(1, n_samples + 1),
            'gestation': np.random.normal(280, 20, n_samples).clip(240, 320),
            'age': np.random.normal(28, 5, n_samples).clip(18, 45),
            'height': np.random.normal(165, 8, n_samples).clip(150, 180),
            'weight': np.random.normal(65, 12, n_samples).clip(45, 100),
            'parity': np.random.choice([0, 1, 2], n_samples, p=[0.6, 0.3, 0.1]),
            'smoke': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
        }
        
        # Calculate more realistic baby weights based on features
        # Base weight increases with gestational age
        base_weight = 2500 + (data['gestation'] - 240) * 15  # More realistic progression
        
        # Age factor - older mothers tend to have slightly larger babies
        age_factor = np.where(data['age'] < 25, -50, 
                             np.where(data['age'] > 35, 100, 0))
        
        # Height factor - taller mothers tend to have larger babies
        height_factor = (data['height'] - 165) * 8
        
        # Weight factor - heavier mothers tend to have larger babies
        weight_factor = (data['weight'] - 65) * 5
        
        # Parity factor - multiparous mothers tend to have larger babies
        parity_factor = data['parity'] * 100
        
        # Smoking factor - smoking reduces baby weight
        smoke_factor = data['smoke'] * -200
        
        # Calculate final weight with realistic variation
        data['bwt'] = (
            base_weight + age_factor + height_factor + weight_factor + parity_factor + smoke_factor +
            np.random.normal(0, 300, n_samples)  # Increased variation
        ).clip(2000, 5000)  # More realistic range
        
        return pd.DataFrame(data)
    
    async def predict(self, request: BabyWeightRequest) -> PredictionResponse:
        """Make a baby weight prediction"""
        try:
            if self.model is None:
                raise ValueError("Model not loaded. Please train or load the model first.")
            
            # Prepare input data
            input_data = {
                'gestation_weeks': request.gestational_age,
                'age': request.maternal_age,
                'height': request.maternal_height,
                'weight': request.maternal_weight,
                'parity': request.previous_pregnancies,
                'smoke': request.smoking_status,
                'bmi': request.maternal_weight / ((request.maternal_height / 100) ** 2)
            }
            
            # Convert to array and scale
            X = np.array([list(input_data.values())])
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            predicted_weight = self.model.predict(X_scaled)[0]
            
            # Add some debugging
            logger.info(f"Raw prediction: {predicted_weight}")
            logger.info(f"Input features: {input_data}")
            
            # Ensure prediction is reasonable
            if predicted_weight < 1000 or predicted_weight > 6000:
                logger.warning(f"Unrealistic prediction: {predicted_weight}g, using fallback calculation")
                # Use a simple formula as fallback
                base_weight = 2500 + (request.gestational_age - 24) * 100
                age_factor = 0 if 25 <= request.maternal_age <= 35 else (50 if request.maternal_age > 35 else -50)
                height_factor = (request.maternal_height - 165) * 5
                weight_factor = (request.maternal_weight - 65) * 3
                parity_factor = request.previous_pregnancies * 50
                smoke_factor = request.smoking_status * -100
                
                predicted_weight = base_weight + age_factor + height_factor + weight_factor + parity_factor + smoke_factor
                predicted_weight = max(2000, min(5000, predicted_weight))
            
            # Final clipping to reasonable range
            predicted_weight = max(2000, min(5000, predicted_weight))
            
            # Determine weight category and risk level
            if predicted_weight < 2500:
                weight_category = "Low Birth Weight"
                risk_level = RiskLevel.LOW
                recommendation = "Consider discussing nutrition and monitoring with your doctor."
            elif predicted_weight > 4000:
                weight_category = "High Birth Weight"
                risk_level = RiskLevel.MEDIUM
                recommendation = "Monitor glucose levels and discuss delivery plans with your healthcare provider."
            else:
                weight_category = "Normal Birth Weight"
                risk_level = RiskLevel.NORMAL
                recommendation = "Predicted weight is within normal range. Continue regular check-ups."
            
            # Calculate confidence (simplified)
            confidence = 0.85  # This could be calculated based on model uncertainty
            
            return PredictionResponse(
                success=True,
                prediction_type="baby_weight",
                predicted_weight=round(predicted_weight),
                weight_category=weight_category,
                risk_level=risk_level,
                recommendation=recommendation,
                confidence=confidence,
                disclaimer="This prediction is based on statistical models and should not replace professional medical advice. Actual birth weight can vary significantly.",
                model_version=self.model_version,
                prediction_timestamp=datetime.now().isoformat(),
                input_data=input_data
            )
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise e
    
    def evaluate_model(self, test_data_path: str) -> Dict[str, float]:
        """Evaluate model performance on test data"""
        try:
            df = self.load_csv_data(test_data_path)
            processed_df = self.preprocess_data(df)
            
            X = processed_df[['gestation_weeks', 'age', 'height', 'weight', 'parity', 'smoke', 'bmi']]
            y = processed_df['bwt']
            
            X_scaled = self.scaler.transform(X)
            y_pred = self.model.predict(X_scaled)
            
            metrics = {
                'mae': mean_absolute_error(y, y_pred),
                'rmse': np.sqrt(mean_squared_error(y, y_pred)),
                'r2': r2_score(y, y_pred)
            }
            
            logger.info(f"Model evaluation metrics: {metrics}")
            return metrics
            
        except Exception as e:
            logger.error(f"Error evaluating model: {e}")
            raise e
