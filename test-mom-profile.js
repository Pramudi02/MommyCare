const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data for mom profile
const testProfileData = {
  name: "Emma Wilson",
  phone: "123-456-7890",
  age: 28,
  bloodGroup: "A+",
  height: {
    value: 165,
    unit: "cm"
  },
  weight: {
    value: 78,
    unit: "kg"
  },
  currentBMI: 28.6,
  lmp: "2024-08-01",
  edd: "2025-05-08",
  consultantObstetrician: "Dr. Perera",
  mohArea: "Colombo",
  phmArea: "Dehiwala",
  fieldClinic: "Dehiwala Field Clinic",
  gramaNiladhariDivision: "Dehiwala GN Division",
  hospitalClinic: "Dehiwala Hospital",
  nextClinicDate: "2024-12-15",
  emergencyContact: {
    name: "John Wilson",
    phone: "098-765-4321",
    relationship: "Husband"
  },
  medicalHistory: {
    allergies: ["Penicillin"],
    chronicConditions: [],
    previousPregnancies: 1,
    complications: []
  },
  currentPregnancy: {
    week: 20,
    trimester: 2,
    isHighRisk: false,
    riskFactors: []
  }
};

async function testMomProfileAPI() {
  console.log('🧪 Testing Mom Profile API...\n');

  try {
    // First, we need to get a valid token (this would normally come from login)
    console.log('⚠️  Note: This test requires a valid authentication token.');
    console.log('   Please ensure you have logged in and have a valid token in localStorage.\n');

    // Test 1: Create/Update Profile
    console.log('1️⃣ Testing POST /api/mom/profile (Create/Update Profile)');
    try {
      const createResponse = await axios.post(`${API_BASE_URL}/mom/profile`, testProfileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
        }
      });
      console.log('✅ Profile created/updated successfully');
      console.log('   Response:', JSON.stringify(createResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Failed to create/update profile');
      console.log('   Error:', error.response?.data || error.message);
    }

    console.log('\n2️⃣ Testing GET /api/mom/profile (Get Profile)');
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/mom/profile`, {
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
        }
      });
      console.log('✅ Profile retrieved successfully');
      console.log('   Response:', JSON.stringify(getResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Failed to get profile');
      console.log('   Error:', error.response?.data || error.message);
    }

    console.log('\n3️⃣ Testing PUT /api/mom/profile (Update Profile)');
    try {
      const updateData = {
        ...testProfileData,
        age: 29,
        currentBMI: 29.0
      };
      const updateResponse = await axios.put(`${API_BASE_URL}/mom/profile`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
        }
      });
      console.log('✅ Profile updated successfully');
      console.log('   Response:', JSON.stringify(updateResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Failed to update profile');
      console.log('   Error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n📝 Test Instructions:');
  console.log('1. Start the backend server: cd backend && npm start');
  console.log('2. Login to get a valid token');
  console.log('3. Replace "YOUR_TOKEN_HERE" with the actual token');
  console.log('4. Run this test: node test-mom-profile.js');
}

// Run the test
testMomProfileAPI();
