// Test script to login as admin and test permission request endpoints
// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:5000/api';

async function testAdminEndpoints() {
  try {
    console.log('🔍 Testing admin endpoints...');
    
    // Step 1: Login as admin
    console.log('🔐 Logging in as admin...');
    const adminLoginResponse = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'newadmin@mommycare.com',
        password: '123456'
      })
    });
    
    if (!adminLoginResponse.ok) {
      const errorData = await adminLoginResponse.json();
      console.log('❌ Admin login failed:', errorData);
      return;
    }
    
    const adminLoginResult = await adminLoginResponse.json();
    const adminToken = adminLoginResult.token;
    console.log('✅ Admin login successful');
    
    // Step 2: Test permission requests endpoint
    console.log('📋 Testing permission requests endpoint...');
    const requestsResponse = await fetch(`${API_BASE}/permission-requests`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log('Requests response status:', requestsResponse.status);
    if (requestsResponse.ok) {
      const requestsData = await requestsResponse.json();
      console.log('✅ Permission requests data:', requestsData);
    } else {
      const errorData = await requestsResponse.json();
      console.log('❌ Requests error:', errorData);
    }
    
    // Step 3: Test stats endpoint
    console.log('📊 Testing stats endpoint...');
    const statsResponse = await fetch(`${API_BASE}/permission-requests/stats`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log('Stats response status:', statsResponse.status);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats data:', statsData);
    } else {
      const errorData = await statsResponse.json();
      console.log('❌ Stats error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin endpoints:', error);
  }
}

testAdminEndpoints();

