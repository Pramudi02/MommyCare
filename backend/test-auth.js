const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing JWT Authentication Flow...\n');

  try {
    // Test 1: Register a new user
    console.log('1️. Testing User Registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'doctor'
    };

    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });

    const registerResult = await registerResponse.json();
    console.log('Registration Status:', registerResponse.status);
    console.log('Registration Response:', registerResult);

    if (registerResponse.ok) {
      const token = registerResult.token;
      console.log('✅ Registration successful! Token received.\n');

      // Test 2: Test protected route with token
      console.log('2️⃣ Testing Protected Route...');
      const protectedResponse = await fetch(`${BASE_URL}/doctor/permission-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hospitalName: 'Test Hospital',
          hospitalAddress: '123 Test St',
          hospitalPhone: '+1234567890',
          hospitalEmail: 'test@hospital.com',
          doctorSpecialization: 'Obstetrics',
          registrationNumber: 'DOC123',
          licenseNumber: 'LIC456',
          yearsOfExperience: '5-10',
          location: {
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country'
          }
        })
      });

      const protectedResult = await protectedResponse.json();
      console.log('Protected Route Status:', protectedResponse.status);
      console.log('Protected Route Response:', protectedResult);

      if (protectedResponse.ok) {
        console.log('✅ Protected route access successful!\n');
      } else {
        console.log('❌ Protected route access failed!\n');
      }

      // Test 3: Test login
      console.log('3️⃣ Testing User Login...');
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const loginResult = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', loginResult);

      if (loginResponse.ok) {
        console.log('✅ Login successful!\n');
      } else {
        console.log('❌ Login failed!\n');
      }

    } else {
      console.log('❌ Registration failed!\n');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testAuth();
