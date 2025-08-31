import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import joblib
import os
from datetime import datetime
from loguru import logger
from typing import Dict, Any, Optional
import xgboost as xgb
import lightgbm as lgb

from schemas.prediction_schemas import DiabetesRequest, PredictionResponse, RiskLevel

class DiabetesPredictor:
    def __init__(self, model_path: str = "models/saved/diabetes_model.joblib"):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()
        self.model_version = "1.0.0"
        self.feature_names = [
            'age', 'pregnancy_no', 'weight', 'height', 'bmi', 'heredity'
        ]
        
    async def load_model(self):
        """Load the trained model from disk"""
        try:
            if os.path.exists(self.model_path):
                logger.info(f"Loading existing diabetes model from {self.model_path}")
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
                logger.warning("No existing diabetes model found. Training new model...")
                await self.train_model()
        except Exception as e:
            logger.error(f"Error loading diabetes model: {e}")
            await self.train_model()
    
    def load_csv_data(self, file_path: str) -> pd.DataFrame:
        """Load diabetes data from CSV file"""
        try:
            logger.info(f"Loading diabetes data from CSV file: {file_path}")
            
            # Load the CSV file
            df = pd.read_csv(file_path)
            
            logger.info(f"Loaded {len(df)} records from CSV file")
            logger.info(f"Columns: {df.columns.tolist()}")
            
            return df
            
        except Exception as e:
            logger.error(f"Error loading CSV data: {e}")
            raise e
    
    def preprocess_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess the diabetes data for training"""
        try:
            logger.info("Preprocessing diabetes data...")
            
            # Create a copy to avoid modifying original data
            processed_df = df.copy()
            
            # Handle missing values
            processed_df = processed_df.dropna()
            
            # Ensure all required columns exist
            required_columns = [
                'Age', 'Pregnancy No', 'Weight', 'Height', 'BMI', 'Heredity', 'Prediction'
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
            
            # Ensure binary classification (0 = no diabetes, 1 = diabetes)
            processed_df['Prediction'] = (processed_df['Prediction'] > 0).astype(int)
            
            logger.info(f"Preprocessed diabetes data shape: {processed_df.shape}")
            return processed_df
            
        except Exception as e:
            logger.error(f"Error preprocessing diabetes data: {e}")
            raise e
    
    async def train_model(self, data_file_path: Optional[str] = None):
        """Train the diabetes prediction model"""
        try:
            logger.info("Starting diabetes model training...")
            
            # Load data
            if data_file_path:
                df = self.load_csv_data(data_file_path)
            else:
                # Use the GestationalDiabetes.csv file in uploads directory
                upload_path = "uploads/GestationalDiabetes.csv"
                if os.path.exists(upload_path):
                    df = self.load_csv_data(upload_path)
                else:
                    # Use sample data if no file provided
                    df = self.generate_sample_data()
            
            # Preprocess data
            processed_df = self.preprocess_data(df)
            
            # Prepare features and target
            X = processed_df[['Age', 'Pregnancy No', 'Weight', 'Height', 'BMI', 'Heredity']]
            y = processed_df['Prediction']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train multiple models and select the best one
            models = {
                'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingClassifier(random_state=42),
                'xgboost': xgb.XGBClassifier(random_state=42),
                'lightgbm': lgb.LGBMClassifier(random_state=42),
                'logistic_regression': LogisticRegression(random_state=42)
            }
            
            best_model = None
            best_score = -np.inf
            
            for name, model in models.items():
                logger.info(f"Training {name}...")
                model.fit(X_train_scaled, y_train)
                
                # Evaluate model
                y_pred = model.predict(X_test_scaled)
                score = roc_auc_score(y_test, y_pred)
                
                logger.info(f"{name} ROC AUC score: {score:.4f}")
                
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
            
            logger.info(f"Diabetes model training completed. Best ROC AUC score: {best_score:.4f}")
            logger.info(f"Model saved to {self.model_path}")
            
        except Exception as e:
            logger.error(f"Error training diabetes model: {e}")
            raise e
    
    def generate_sample_data(self) -> pd.DataFrame:
        """Generate sample diabetes data for training if no CSV file is available"""
        logger.info("Generating sample diabetes training data...")
        
        np.random.seed(42)
        n_samples = 1000
        
        data = {
            'Age': np.random.normal(30, 6, n_samples).clip(18, 45),
            'Pregnancy No': np.random.choice([1, 2, 3, 4, 5], n_samples, p=[0.4, 0.3, 0.2, 0.08, 0.02]),
            'Weight': np.random.normal(70, 15, n_samples).clip(45, 120),
            'Height': np.random.normal(160, 8, n_samples).clip(145, 180),
            'BMI': np.random.normal(27, 5, n_samples).clip(18, 45),
            'Heredity': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        }
        
        # Calculate realistic diabetes risk based on features
        risk_factors = (
            (data['Age'] - 25) * 0.02 +  # Age factor
            (data['BMI'] - 25) * 0.03 +  # BMI factor
            (data['Pregnancy No'] - 1) * 0.1 +  # Pregnancy number factor
            data['Heredity'] * 0.3  # Family history
        )
        
        # Add some randomness
        risk_factors += np.random.normal(0, 0.1, n_samples)
        
        # Convert to binary classification (diabetes or not)
        data['Prediction'] = (risk_factors > 0.3).astype(int)
        
        return pd.DataFrame(data)
    
    async def predict(self, request: DiabetesRequest) -> PredictionResponse:
        """Make a diabetes risk prediction"""
        try:
            if self.model is None:
                raise ValueError("Diabetes model not loaded. Please train or load the model first.")
            
            # Prepare input data - map schema fields to model features
            input_data = {
                'Age': request.age,
                'Pregnancy No': request.pregnancy_no,
                'Weight': request.weight,
                'Height': request.height,
                'BMI': request.bmi,
                'Heredity': request.heredity
            }
            
            # Convert to array and scale
            X = np.array([list(input_data.values())])
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            risk_probability = self.model.predict_proba(X_scaled)[0][1]  # Probability of diabetes
            risk_score = risk_probability * 100  # Convert to percentage
            
            # Determine risk level and recommendation
            if risk_score <= 30:
                risk_level = RiskLevel.LOW
                risk_assessment = "Low Risk"
                recommendation = "Your risk appears low. Continue healthy eating and regular exercise. Monitor with routine check-ups."
            elif risk_score <= 60:
                risk_level = RiskLevel.MEDIUM
                risk_assessment = "Moderate Risk"
                recommendation = "You may have moderate risk. Consider more frequent glucose monitoring and dietary consultation."
            else:
                risk_level = RiskLevel.HIGH
                risk_assessment = "High Risk"
                recommendation = "You may be at higher risk. Please consult your healthcare provider immediately for proper testing and monitoring."
            
            # Calculate confidence (simplified)
            confidence = 0.80  # This could be calculated based on model uncertainty
            
            return PredictionResponse(
                success=True,
                prediction_type="diabetes",
                risk_score=round(risk_score, 1),
                risk_assessment=risk_assessment,
                risk_level=risk_level,
                recommendation=recommendation,
                confidence=confidence,
                disclaimer="This is a preliminary risk assessment tool. Only proper medical testing can definitively diagnose gestational diabetes. Please consult your healthcare provider.",
                model_version=self.model_version,
                prediction_timestamp=datetime.now().isoformat(),
                input_data=input_data
            )
            
        except Exception as e:
            logger.error(f"Error making diabetes prediction: {e}")
            raise e
    
    def evaluate_model(self, test_data_path: str) -> Dict[str, float]:
        """Evaluate diabetes model performance on test data"""
        try:
            df = self.load_csv_data(test_data_path)
            processed_df = self.preprocess_data(df)
            
            X = processed_df[['Age', 'Pregnancy No', 'Weight', 'Height', 'BMI', 'Heredity']]
            y = processed_df['Prediction']
            
            X_scaled = self.scaler.transform(X)
            y_pred = self.model.predict(X_scaled)
            y_pred_proba = self.model.predict_proba(X_scaled)[:, 1]
            
            metrics = {
                'accuracy': accuracy_score(y, y_pred),
                'roc_auc': roc_auc_score(y, y_pred_proba)
            }
            
            logger.info(f"Diabetes model evaluation metrics: {metrics}")
            return metrics
            
        except Exception as e:
            logger.error(f"Error evaluating diabetes model: {e}")
            raise e
