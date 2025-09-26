// Test script to create a user and permission request via API
// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:5000/api';

async function createTestData() {
  try {
    console.log('🔍 Creating test data via API...');
    
    // Step 1: Register a test user
    console.log('📝 Registering test user...');
    const userData = {
      firstName: 'Test',
      lastName: 'Doctor',
      email: 'testdoctor@example.com',
      password: '123456',
      role: 'doctor'
    };
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData);
      return;
    }
    
    const registerResult = await registerResponse.json();
    console.log('✅ User registered successfully');
    
    // Step 2: Login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password
      })
    });
    
    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
      return;
    }
    
    const loginResult = await loginResponse.json();
    const token = loginResult.token;
    console.log('✅ Login successful');
    
    // Step 3: Submit permission request
    console.log('📋 Submitting permission request...');
    const permissionData = {
      userRole: 'doctor',
      hospitalName: 'Test Hospital',
      doctorSpecialization: 'Obstetrics',
      licenseNumber: 'DOC123456',
      yearsOfExperience: 5
    };
    
    const permissionResponse = await fetch(`${API_BASE}/permission-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(permissionData)
    });
    
    if (!permissionResponse.ok) {
      const errorData = await permissionResponse.json();
      console.log('❌ Permission request failed:', errorData);
      return;
    }
    
    const permissionResult = await permissionResponse.json();
    console.log('✅ Permission request submitted successfully');
    console.log('🎉 Test data created successfully!');
    
    // Step 4: Test admin endpoints (this will fail without admin token, but let's see the response)
    console.log('🔍 Testing admin endpoints...');
    const statsResponse = await fetch(`${API_BASE}/permission-requests/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Stats response status:', statsResponse.status);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('Stats data:', statsData);
    } else {
      const errorData = await statsResponse.json();
      console.log('Stats error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

createTestData();
