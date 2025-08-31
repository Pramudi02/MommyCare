#!/usr/bin/env python3
"""
Test script to verify AI backend integration
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_baby_weight_prediction():
    """Test baby weight prediction endpoint"""
    print("\n🔍 Testing baby weight prediction...")
    
    # Test data based on your CSV format
    test_data = {
        "gestational_age": 40.0,  # 40 weeks
        "maternal_age": 28,
        "maternal_height": 165,
        "maternal_weight": 65,
        "previous_pregnancies": 0,
        "smoking_status": 0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict/baby-weight",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Baby weight prediction successful")
            print(f"   Predicted weight: {result.get('predicted_weight', 'N/A')}g")
            print(f"   Category: {result.get('weight_category', 'N/A')}")
            print(f"   Risk level: {result.get('risk_level', 'N/A')}")
            print(f"   Recommendation: {result.get('recommendation', 'N/A')}")
            return True
        else:
            print(f"❌ Baby weight prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Baby weight prediction error: {e}")
        return False

def test_diabetes_prediction():
    """Test diabetes prediction endpoint"""
    print("\n🔍 Testing diabetes prediction...")
    
    test_data = {
        "age": 30,
        "height": 165,
        "bmi": 26.5,
        "family_history": 0,
        "previous_gd": 0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict/diabetes",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_data)
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Diabetes prediction successful")
            print(f"   Risk score: {result.get('risk_score', 'N/A')}%")
            print(f"   Risk assessment: {result.get('risk_assessment', 'N/A')}")
            print(f"   Recommendation: {result.get('recommendation', 'N/A')}")
            return True
        else:
            print(f"❌ Diabetes prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Diabetes prediction error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting AI Backend Integration Tests")
    print("=" * 50)
    
    # Wait a moment for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Run tests
    tests = [
        test_health_check,
        test_baby_weight_prediction,
        test_diabetes_prediction
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    # Summary
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your AI backend is working correctly.")
        print("\n📝 Next steps:")
        print("1. Start your React frontend")
        print("2. Navigate to the Predictions page")
        print("3. Test the baby weight prediction form")
        print("4. Verify the results match the API responses")
    else:
        print("⚠️  Some tests failed. Please check the AI backend logs.")
        print("\n🔧 Troubleshooting:")
        print("1. Ensure the AI backend is running on port 8000")
        print("2. Check that babies.csv is in the uploads directory")
        print("3. Verify all dependencies are installed")
        print("4. Check the backend logs for errors")

if __name__ == "__main__":
    main()

