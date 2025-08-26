const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  babyBirthDate: '2025-01-15',
  vaccine: 'B.C.G Second Dose',
  preferredDate: '2025-02-20',
  preferredTime: 'Morning',
  location: 'Main Clinic',
  notes: 'Test vaccination appointment'
};

// Mock token (in real scenario, this would come from login)
const mockToken = 'your-test-token-here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${mockToken}`
};

async function testVaccinationAPI() {
  console.log('🧪 Testing Vaccination API Endpoints...\n');

  try {
    // Test 1: Initialize vaccination schedule
    console.log('1. Testing vaccination schedule initialization...');
    try {
      const initResponse = await axios.post(
        `${API_BASE_URL}/mom/vaccinations/initialize`,
        { babyBirthDate: testData.babyBirthDate },
        { headers }
      );
      console.log('✅ Vaccination schedule initialized successfully');
      console.log(`   Created ${initResponse.data.data.length} vaccination records\n`);
    } catch (error) {
      console.log('❌ Failed to initialize vaccination schedule:', error.response?.data?.message || error.message);
    }

    // Test 2: Get all vaccinations
    console.log('2. Testing get all vaccinations...');
    try {
      const getResponse = await axios.get(
        `${API_BASE_URL}/mom/vaccinations`,
        { headers }
      );
      console.log('✅ Retrieved vaccinations successfully');
      console.log(`   Found ${getResponse.data.data.length} vaccination records\n`);
    } catch (error) {
      console.log('❌ Failed to get vaccinations:', error.response?.data?.message || error.message);
    }

    // Test 3: Request vaccination appointment
    console.log('3. Testing vaccination appointment request...');
    try {
      const appointmentResponse = await axios.post(
        `${API_BASE_URL}/mom/vaccinations/request-appointment`,
        {
          vaccine: testData.vaccine,
          preferredDate: testData.preferredDate,
          preferredTime: testData.preferredTime,
          location: testData.location,
          notes: testData.notes
        },
        { headers }
      );
      console.log('✅ Vaccination appointment requested successfully');
      console.log(`   Request ID: ${appointmentResponse.data.data.request._id}`);
      console.log(`   Redirect to: ${appointmentResponse.data.data.redirectTo}\n`);
    } catch (error) {
      console.log('❌ Failed to request appointment:', error.response?.data?.message || error.message);
    }

    // Test 4: Verify clinic visit request was created
    console.log('4. Testing clinic visit requests...');
    try {
      const clinicResponse = await axios.get(
        `${API_BASE_URL}/mom/clinic-visit-requests`,
        { headers }
      );
      console.log('✅ Retrieved clinic visit requests successfully');
      console.log(`   Found ${clinicResponse.data.data.length} clinic visit requests`);
      
      const vaccinationRequests = clinicResponse.data.data.filter(req => req.requestType === 'Vaccinations');
      console.log(`   Found ${vaccinationRequests.length} vaccination requests\n`);
    } catch (error) {
      console.log('❌ Failed to get clinic visit requests:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testVaccinationAPI();
