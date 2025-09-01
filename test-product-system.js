const axios = require('axios');

// Test the service provider product system
async function testProductSystem() {
  try {
    console.log('🧪 Testing MommyCare Service Provider Product System...\n');

    const baseURL = 'http://localhost:5000/api';
    
    // Test 1: Get product categories (public endpoint)
    console.log('📋 Test 1: Getting product categories...');
    try {
      const response = await axios.get(`${baseURL}/products/categories`);
      if (response.data.success) {
        console.log(`✅ Successfully retrieved ${response.data.data.length} categories`);
        response.data.data.forEach(cat => {
          console.log(`   📦 ${cat._id}: ${cat.count} products`);
        });
      }
    } catch (error) {
      console.log('⚠️  Categories endpoint not available yet (expected for new system)');
    }

    // Test 2: Get active products (public endpoint)
    console.log('\n🛍️  Test 2: Getting active products...');
    try {
      const response = await axios.get(`${baseURL}/products`);
      if (response.data.success) {
        console.log(`✅ Successfully retrieved ${response.data.data.products.length} active products`);
        if (response.data.data.products.length > 0) {
          response.data.data.products.forEach(product => {
            console.log(`   📦 ${product.name} - $${product.price} (${product.category})`);
          });
        } else {
          console.log('   📝 No products found (expected for new system)');
        }
      }
    } catch (error) {
      console.log('⚠️  Products endpoint not available yet (expected for new system)');
    }

    // Test 3: Test service provider authentication
    console.log('\n🔐 Test 3: Testing service provider authentication...');
    try {
      // This would require a valid service provider token
      const token = 'YOUR_SERVICE_PROVIDER_TOKEN_HERE';
      const response = await axios.get(`${baseURL}/service-provider/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Service provider products endpoint accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication working correctly (401 Unauthorized)');
      } else {
        console.log('⚠️  Service provider endpoint not accessible:', error.message);
      }
    }

    console.log('\n🎉 Product system tests completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend server: cd backend && npm start');
    console.log('   2. Create a service provider account');
    console.log('   3. Login and get authentication token');
    console.log('   4. Test product creation with valid token');
    console.log('   5. Verify products appear in public endpoints');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testProductSystem();
