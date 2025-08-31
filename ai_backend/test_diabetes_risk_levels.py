#!/usr/bin/env python3
"""
Test script to verify different diabetes risk levels
"""

import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.diabetes_predictor import DiabetesPredictor
from schemas.prediction_schemas import DiabetesRequest

async def test_diabetes_risk_levels():
    """Test diabetes prediction with different risk levels"""
    
    print("🧪 Testing Diabetes Risk Levels...\n")
    
    try:
        # Initialize the diabetes predictor
        diabetes_predictor = DiabetesPredictor()
        await diabetes_predictor.load_model()
        
        if diabetes_predictor.model is None:
            print("❌ Model not loaded!")
            return
        
        print("✅ Model loaded successfully!")
        print("=" * 60)
        
        # Test cases for different risk levels
        test_cases = [
            {
                "name": "LOW RISK - Young, Normal BMI, No History",
                "data": {
                    "age": 22,
                    "pregnancy_no": 1,
                    "weight": 55,
                    "height": 165,
                    "bmi": 20.2,
                    "heredity": 0
                },
                "expected_risk": "Low"
            },
            {
                "name": "LOW RISK - Normal Age, Healthy Weight",
                "data": {
                    "age": 28,
                    "pregnancy_no": 1,
                    "weight": 58,
                    "height": 160,
                    "bmi": 22.7,
                    "heredity": 0
                },
                "expected_risk": "Low"
            },
            {
                "name": "MODERATE RISK - Older Age, Overweight",
                "data": {
                    "age": 32,
                    "pregnancy_no": 2,
                    "weight": 75,
                    "height": 160,
                    "bmi": 29.3,
                    "heredity": 0
                },
                "expected_risk": "Moderate"
            },
            {
                "name": "MODERATE RISK - Multiple Pregnancies",
                "data": {
                    "age": 29,
                    "pregnancy_no": 3,
                    "weight": 70,
                    "height": 165,
                    "bmi": 25.7,
                    "heredity": 0
                },
                "expected_risk": "Moderate"
            },
            {
                "name": "HIGH RISK - Older Age, Obese, Family History",
                "data": {
                    "age": 38,
                    "pregnancy_no": 2,
                    "weight": 95,
                    "height": 155,
                    "bmi": 39.5,
                    "heredity": 1
                },
                "expected_risk": "High"
            },
            {
                "name": "HIGH RISK - Very High BMI",
                "data": {
                    "age": 35,
                    "pregnancy_no": 1,
                    "weight": 110,
                    "height": 160,
                    "bmi": 43.0,
                    "heredity": 0
                },
                "expected_risk": "High"
            },
            {
                "name": "HIGH RISK - Advanced Age, Multiple Risk Factors",
                "data": {
                    "age": 42,
                    "pregnancy_no": 4,
                    "weight": 85,
                    "height": 150,
                    "bmi": 37.8,
                    "heredity": 1
                },
                "expected_risk": "High"
            }
        ]
        
        results = []
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"Test {i}: {test_case['name']}")
            print(f"   Input: Age={test_case['data']['age']}, Weight={test_case['data']['weight']}kg, Height={test_case['data']['height']}cm, BMI={test_case['data']['bmi']}, Pregnancy={test_case['data']['pregnancy_no']}, Heredity={test_case['data']['heredity']}")
            
            try:
                # Create request object
                request = DiabetesRequest(**test_case['data'])
                
                # Make prediction
                result = await diabetes_predictor.predict(request)
                
                risk_score = result.risk_score
                risk_assessment = result.risk_assessment
                expected_risk = test_case['expected_risk']
                
                # Determine actual risk level
                if risk_score <= 30:
                    actual_risk = "Low"
                elif risk_score <= 60:
                    actual_risk = "Moderate"
                else:
                    actual_risk = "High"
                
                # Check if prediction matches expectation
                match = "✅" if actual_risk == expected_risk else "❌"
                
                print(f"   → Risk Score: {risk_score:.1f}%")
                print(f"   → Assessment: {risk_assessment}")
                print(f"   → Actual Risk: {actual_risk}")
                print(f"   → Expected Risk: {expected_risk}")
                print(f"   → Match: {match}")
                
                results.append({
                    "test": i,
                    "name": test_case['name'],
                    "expected": expected_risk,
                    "actual": actual_risk,
                    "score": risk_score,
                    "match": actual_risk == expected_risk
                })
                
            except Exception as e:
                print(f"   → Error: {e}")
                results.append({
                    "test": i,
                    "name": test_case['name'],
                    "expected": expected_risk,
                    "actual": "Error",
                    "score": 0,
                    "match": False
                })
            
            print()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(results)
        passed_tests = sum(1 for r in results if r['match'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for result in results:
                if not result['match']:
                    print(f"   Test {result['test']}: {result['name']}")
                    print(f"      Expected: {result['expected']}, Got: {result['actual']}")
        
        print("\n🎯 Manual Testing Instructions:")
        print("1. Start the AI backend: python main.py")
        print("2. Open the frontend and go to Predictions page")
        print("3. Click on 'Gestational Diabetes Risk' tab")
        print("4. Test with these sample inputs:")
        
        for i, test_case in enumerate(test_cases[:3], 1):  # Show first 3 for manual testing
            data = test_case['data']
            print(f"   Test {i} ({test_case['expected_risk']} Risk):")
            print(f"      Age: {data['age']}, Weight: {data['weight']}kg, Height: {data['height']}cm")
            print(f"      BMI: {data['bmi']}, Pregnancy: {data['pregnancy_no']}, Heredity: {data['heredity']}")
            print()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_diabetes_risk_levels())
