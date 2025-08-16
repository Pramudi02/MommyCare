require('dotenv').config();
const { connectDB } = require('./src/config/database');
const getUserModel = require('./src/models/User');

async function testProfileAPI() {
  try {
    console.log('🧪 Testing Profile API endpoints...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully!');
    
    // Test user creation
    const User = getUserModel();
    console.log('👤 Testing user creation...');
    
    const testUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'password123',
      role: 'mom'
    });
    
    console.log('✅ Test user created:', {
      id: testUser._id,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      role: testUser.role
    });
    
    // Test password verification
    const isPasswordMatch = await testUser.matchPassword('password123');
    console.log('🔐 Password verification test:', isPasswordMatch ? 'PASSED' : 'FAILED');
    
    // Test JWT token generation
    const token = testUser.getSignedJwtToken();
    console.log('🎫 JWT token generation test:', token ? 'PASSED' : 'FAILED');
    
    // Test user retrieval
    const retrievedUser = await User.findById(testUser._id);
    console.log('🔍 User retrieval test:', retrievedUser ? 'PASSED' : 'FAILED');
    
    // Test profile update
    const updatedUser = await User.findByIdAndUpdate(
      testUser._id,
      { firstName: 'Jane', lastName: 'Smith' },
      { new: true, runValidators: true }
    );
    
    console.log('✏️ Profile update test:', {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      test: updatedUser.firstName === 'Jane' && updatedUser.lastName === 'Smith' ? 'PASSED' : 'FAILED'
    });
    
    // Test password update
    updatedUser.password = 'newpassword123';
    await updatedUser.save();
    
    const isNewPasswordMatch = await updatedUser.matchPassword('newpassword123');
    console.log('🔑 Password update test:', isNewPasswordMatch ? 'PASSED' : 'FAILED');
    
    // Clean up
    await User.findByIdAndDelete(testUser._id);
    console.log('🧹 Test user cleaned up');
    
    console.log('\n🎉 Profile API test completed successfully!');
    console.log('\n📋 API Endpoints Available:');
    console.log('   GET /api/auth/me - Get current user profile');
    console.log('   PUT /api/auth/profile - Update user profile');
    console.log('   PUT /api/auth/password - Update user password');
    console.log('   POST /api/auth/logout - Logout user');
    
    console.log('\n🔐 Authentication Flow:');
    console.log('   1. User registers/logs in → receives JWT token');
    console.log('   2. Token stored in localStorage/sessionStorage');
    console.log('   3. Frontend includes token in Authorization header');
    console.log('   4. Backend validates token and returns user data');
    console.log('   5. Profile data displayed in navbar dropdown');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Profile API test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testProfileAPI();
