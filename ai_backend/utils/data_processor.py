import pandas as pd
import numpy as np
import os
from datetime import datetime
from loguru import logger
from typing import Dict, Any, Optional, List
import shutil

class DataProcessor:
    def __init__(self, upload_dir: str = "uploads", processed_dir: str = "data/processed"):
        self.upload_dir = upload_dir
        self.processed_dir = processed_dir
        self.supported_formats = ['.csv', '.xlsx', '.xls']
        
        # Create directories if they don't exist
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.processed_dir, exist_ok=True)
    
    def detect_data_type(self, file_path: str) -> str:
        """Detect the type of data in the file"""
        try:
            df = pd.read_csv(file_path)
            columns = df.columns.tolist()
            
            # Check for baby weight data columns
            baby_weight_columns = ['case', 'bwt', 'gestation', 'parity', 'age', 'height', 'weight', 'smoke']
            if all(col in columns for col in baby_weight_columns):
                return 'baby_weight'
            
            # Check for diabetes data columns
            diabetes_columns = ['age', 'bmi', 'glucose', 'family_history', 'previous_gd', 'pregnancy_weeks', 'diabetes_diagnosis']
            if all(col in columns for col in diabetes_columns):
                return 'diabetes'
            
            return 'unknown'
            
        except Exception as e:
            logger.error(f"Error detecting data type: {e}")
            return 'unknown'
    
    def validate_data(self, df: pd.DataFrame, data_type: str) -> Dict[str, Any]:
        """Validate data quality and return validation results"""
        try:
            validation_results = {
                'total_records': len(df),
                'missing_values': {},
                'data_types': {},
                'outliers': {},
                'quality_score': 0.0
            }
            
            # Check for missing values
            missing_values = df.isnull().sum()
            validation_results['missing_values'] = missing_values.to_dict()
            
            # Check data types
            validation_results['data_types'] = df.dtypes.to_dict()
            
            # Check for outliers (basic check)
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                outliers = df[(df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)]
                validation_results['outliers'][col] = len(outliers)
            
            # Calculate quality score
            quality_score = self._calculate_quality_score(df, validation_results)
            validation_results['quality_score'] = quality_score
            
            return validation_results
            
        except Exception as e:
            logger.error(f"Error validating data: {e}")
            return {'error': str(e)}
    
    def _calculate_quality_score(self, df: pd.DataFrame, validation_results: Dict) -> float:
        """Calculate a data quality score"""
        try:
            total_records = validation_results['total_records']
            missing_values = validation_results['missing_values']
            
            # Calculate missing value percentage
            total_missing = sum(missing_values.values())
            missing_percentage = total_missing / (total_records * len(df.columns))
            
            # Calculate outlier percentage
            total_outliers = sum(validation_results['outliers'].values())
            outlier_percentage = total_outliers / (total_records * len(df.select_dtypes(include=[np.number]).columns))
            
            # Quality score based on missing values and outliers
            quality_score = 1.0 - (missing_percentage * 0.7 + outlier_percentage * 0.3)
            
            return max(0.0, min(1.0, quality_score))
            
        except Exception as e:
            logger.error(f"Error calculating quality score: {e}")
            return 0.5
    
    def clean_data(self, df: pd.DataFrame, data_type: str) -> pd.DataFrame:
        """Clean and preprocess the data"""
        try:
            cleaned_df = df.copy()
            
            # Remove duplicate rows
            cleaned_df = cleaned_df.drop_duplicates()
            
            # Handle missing values based on data type
            if data_type == 'baby_weight':
                # For baby weight data, remove rows with missing critical values
                critical_columns = ['bwt', 'gestation', 'age', 'height', 'weight']
                cleaned_df = cleaned_df.dropna(subset=critical_columns)
                
                # Fill missing values for non-critical columns
                cleaned_df['parity'] = cleaned_df['parity'].fillna(0)
                cleaned_df['smoke'] = cleaned_df['smoke'].fillna(0)
                
            elif data_type == 'diabetes':
                # For diabetes data, remove rows with missing critical values
                critical_columns = ['age', 'bmi', 'glucose', 'diabetes_diagnosis']
                cleaned_df = cleaned_df.dropna(subset=critical_columns)
                
                # Fill missing values for non-critical columns
                cleaned_df['family_history'] = cleaned_df['family_history'].fillna(0)
                cleaned_df['previous_gd'] = cleaned_df['previous_gd'].fillna(0)
                cleaned_df['pregnancy_weeks'] = cleaned_df['pregnancy_weeks'].fillna(24)
            
            # Remove outliers for numeric columns
            numeric_columns = cleaned_df.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                Q1 = cleaned_df[col].quantile(0.25)
                Q3 = cleaned_df[col].quantile(0.75)
                IQR = Q3 - Q1
                cleaned_df = cleaned_df[
                    (cleaned_df[col] >= Q1 - 1.5 * IQR) & 
                    (cleaned_df[col] <= Q3 + 1.5 * IQR)
                ]
            
            return cleaned_df
            
        except Exception as e:
            logger.error(f"Error cleaning data: {e}")
            raise e
    
    def save_processed_data(self, df: pd.DataFrame, data_type: str, original_filename: str) -> str:
        """Save processed data to the processed directory"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{data_type}_{timestamp}_{original_filename}"
            file_path = os.path.join(self.processed_dir, filename)
            
            # Save as CSV
            df.to_csv(file_path, index=False)
            
            logger.info(f"Processed data saved to: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error saving processed data: {e}")
            raise e
    
    async def process_new_data(self, file_path: Optional[str] = None) -> Dict[str, Any]:
        """Process new uploaded data"""
        try:
            if file_path is None:
                # Process all files in upload directory
                files = [f for f in os.listdir(self.upload_dir) 
                        if any(f.endswith(ext) for ext in self.supported_formats)]
                
                if not files:
                    return {'message': 'No data files found in upload directory'}
                
                results = []
                for filename in files:
                    file_path = os.path.join(self.upload_dir, filename)
                    result = await self._process_single_file(file_path)
                    results.append(result)
                
                return {'processed_files': results}
            else:
                return await self._process_single_file(file_path)
                
        except Exception as e:
            logger.error(f"Error processing new data: {e}")
            return {'error': str(e)}
    
    async def _process_single_file(self, file_path: str) -> Dict[str, Any]:
        """Process a single data file"""
        try:
            filename = os.path.basename(file_path)
            logger.info(f"Processing file: {filename}")
            
            # Detect data type
            data_type = self.detect_data_type(file_path)
            if data_type == 'unknown':
                return {
                    'filename': filename,
                    'status': 'error',
                    'message': 'Unknown data format'
                }
            
            # Load data
            df = pd.read_csv(file_path)
            
            # Validate data
            validation_results = self.validate_data(df, data_type)
            
            # Clean data
            cleaned_df = self.clean_data(df, data_type)
            
            # Save processed data
            processed_file_path = self.save_processed_data(cleaned_df, data_type, filename)
            
            # Move original file to processed directory
            processed_original_path = os.path.join(
                self.processed_dir, 
                f"original_{filename}"
            )
            shutil.move(file_path, processed_original_path)
            
            return {
                'filename': filename,
                'data_type': data_type,
                'status': 'success',
                'original_records': len(df),
                'processed_records': len(cleaned_df),
                'quality_score': validation_results['quality_score'],
                'processed_file': processed_file_path,
                'validation_results': validation_results
            }
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            return {
                'filename': os.path.basename(file_path),
                'status': 'error',
                'message': str(e)
            }
    
    def get_data_summary(self) -> Dict[str, Any]:
        """Get summary of processed data"""
        try:
            summary = {
                'upload_directory': self.upload_dir,
                'processed_directory': self.processed_dir,
                'uploaded_files': [],
                'processed_files': []
            }
            
            # List uploaded files
            if os.path.exists(self.upload_dir):
                summary['uploaded_files'] = [
                    f for f in os.listdir(self.upload_dir) 
                    if any(f.endswith(ext) for ext in self.supported_formats)
                ]
            
            # List processed files
            if os.path.exists(self.processed_dir):
                summary['processed_files'] = [
                    f for f in os.listdir(self.processed_dir) 
                    if f.endswith('.csv')
                ]
            
            return summary
            
        except Exception as e:
            logger.error(f"Error getting data summary: {e}")
            return {'error': str(e)}
