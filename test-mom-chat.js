const axios = require('axios');

// Test the mom chat system
async function testMomChat() {
  try {
    console.log('🧪 Testing MommyCare Mom Chat System...\n');

    // Test 1: Get healthcare providers (doctors + assigned midwife)
    console.log('📋 Test 1: Getting healthcare providers for mom...');
    
    const response = await axios.get('http://localhost:5000/api/chat/providers', {
      headers: {
        'Authorization': 'Bearer YOUR_MOM_TOKEN_HERE' // Replace with actual mom token
      }
    });

    if (response.data.success) {
      const providers = response.data.data;
      console.log(`✅ Successfully retrieved ${providers.length} providers`);
      
      // Show doctors
      const doctors = providers.filter(p => p.role === 'doctor');
      console.log(`👨‍⚕️ Doctors: ${doctors.length}`);
      doctors.forEach(doctor => {
        console.log(`   - ${doctor.name} (${doctor.specialty})`);
      });
      
      // Show assigned midwife
      const assignedMidwife = providers.find(p => p.isMyMidwife);
      if (assignedMidwife) {
        console.log(`👩‍⚕️ Assigned Midwife: ${assignedMidwife.name} (${assignedMidwife.specialty})`);
      } else {
        console.log('❌ No assigned midwife found');
      }
      
      console.log('\n📊 Provider Details:');
      providers.forEach(provider => {
        console.log(`   ${provider.name}:`);
        console.log(`     Role: ${provider.role}`);
        console.log(`     Specialty: ${provider.specialty}`);
        console.log(`     Assigned: ${provider.isMyMidwife ? 'Yes (Your Midwife)' : 'No'}`);
        console.log(`     Active: ${provider.isActive}`);
        console.log('');
      });
      
    } else {
      console.log('❌ Failed to get providers:', response.data.message);
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
  }
}

// Test 2: Test with different user roles
async function testDifferentRoles() {
  console.log('\n🔐 Testing with different user roles...\n');
  
  try {
    // Test as doctor
    console.log('👨‍⚕️ Testing as doctor...');
    const doctorResponse = await axios.get('http://localhost:5000/api/chat/providers', {
      headers: {
        'Authorization': 'Bearer YOUR_DOCTOR_TOKEN_HERE' // Replace with actual doctor token
      }
    });
    
    if (doctorResponse.data.success) {
      console.log(`✅ Doctor can see ${doctorResponse.data.data.length} providers`);
    }
    
    // Test as midwife
    console.log('\n👩‍⚕️ Testing as midwife...');
    const midwifeResponse = await axios.get('http://localhost:5000/api/chat/providers', {
      headers: {
        'Authorization': 'Bearer YOUR_MIDWIFE_TOKEN_HERE' // Replace with actual midwife token
      }
    });
    
    if (midwifeResponse.data.success) {
      console.log(`✅ Midwife can see ${midwifeResponse.data.data.length} providers`);
    }
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Role test error:', error.response.status, error.response.data.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting MommyCare Chat System Tests...\n');
  
  await testMomChat();
  await testDifferentRoles();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📝 To run these tests:');
  console.log('1. Make sure your backend server is running on port 5000');
  console.log('2. Replace the token placeholders with actual user tokens');
  console.log('3. Run: node test-mom-chat.js');
}

// Export for use in other files
module.exports = { testMomChat, testDifferentRoles };

// Run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

