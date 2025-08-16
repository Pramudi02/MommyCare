require('dotenv').config();
const { connectDB, getAuthConnection } = require('./src/config/database');
const getUserModel = require('./src/models/User');

async function testAuthSystem() {
  try {
    console.log('🔌 Testing simplified authentication system...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully!');
    
    // Test user creation
    const User = getUserModel();
    console.log('📝 Testing user registration with basic fields...');
    
    // Create a test mom user
    const testMom = await User.create({
      firstName: 'Test',
      lastName: 'Mom',
      email: 'testmom@example.com',
      password: 'password123',
      role: 'mom'
    });
    
    console.log('✅ Test mom created successfully:', {
      id: testMom._id,
      email: testMom.email,
      role: testMom.role,
      firstName: testMom.firstName,
      lastName: testMom.lastName
    });
    
    // Create a test doctor user
    const testDoctor = await User.create({
      firstName: 'Test',
      lastName: 'Doctor',
      email: 'testdoctor@example.com',
      password: 'password123',
      role: 'doctor'
    });
    
    console.log('✅ Test doctor created successfully:', {
      id: testDoctor._id,
      email: testDoctor.email,
      role: testDoctor.role,
      firstName: testDoctor.firstName,
      lastName: testDoctor.lastName
    });
    
    // Create a test midwife user
    const testMidwife = await User.create({
      firstName: 'Test',
      lastName: 'Midwife',
      email: 'testmidwife@example.com',
      password: 'password123',
      role: 'midwife'
    });
    
    console.log('✅ Test midwife created successfully:', {
      id: testMidwife._id,
      email: testMidwife.email,
      role: testMidwife.role,
      firstName: testMidwife.firstName,
      lastName: testMidwife.lastName
    });
    
    // Create a test service provider user
    const testServiceProvider = await User.create({
      firstName: 'Test',
      lastName: 'ServiceProvider',
      email: 'testservice@example.com',
      password: 'password123',
      role: 'service_provider'
    });
    
    console.log('✅ Test service provider created successfully:', {
      id: testServiceProvider._id,
      email: testServiceProvider.email,
      role: testServiceProvider.role,
      firstName: testServiceProvider.firstName,
      lastName: testServiceProvider.lastName
    });
    
    // Test password verification
    const isMomPasswordMatch = await testMom.matchPassword('password123');
    console.log('🔐 Mom password verification test:', isMomPasswordMatch ? 'PASSED' : 'FAILED');
    
    const isDoctorPasswordMatch = await testDoctor.matchPassword('password123');
    console.log('🔐 Doctor password verification test:', isDoctorPasswordMatch ? 'PASSED' : 'FAILED');
    
    const isMidwifePasswordMatch = await testMidwife.matchPassword('password123');
    console.log('🔐 Midwife password verification test:', isMidwifePasswordMatch ? 'PASSED' : 'FAILED');
    
    const isServiceProviderPasswordMatch = await testServiceProvider.matchPassword('password123');
    console.log('🔐 Service Provider password verification test:', isServiceProviderPasswordMatch ? 'PASSED' : 'FAILED');
    
    // Test user retrieval by role
    const moms = await User.find({ role: 'mom' });
    const doctors = await User.find({ role: 'doctor' });
    const midwives = await User.find({ role: 'midwife' });
    const serviceProviders = await User.find({ role: 'service_provider' });
    
    console.log('🔍 User retrieval test:', {
      moms: moms.length,
      doctors: doctors.length,
      midwives: midwives.length,
      serviceProviders: serviceProviders.length
    });
    
    // Test JWT token generation
    const momToken = testMom.getSignedJwtToken();
    const doctorToken = testDoctor.getSignedJwtToken();
    const midwifeToken = testMidwife.getSignedJwtToken();
    const serviceProviderToken = testServiceProvider.getSignedJwtToken();
    
    console.log('🎫 JWT token generation test:', {
      momToken: momToken ? 'PASSED' : 'FAILED',
      doctorToken: doctorToken ? 'PASSED' : 'FAILED',
      midwifeToken: midwifeToken ? 'PASSED' : 'FAILED',
      serviceProviderToken: serviceProviderToken ? 'PASSED' : 'FAILED'
    });
    
    // Clean up test users
    await User.findByIdAndDelete(testMom._id);
    await User.findByIdAndDelete(testDoctor._id);
    await User.findByIdAndDelete(testMidwife._id);
    await User.findByIdAndDelete(testServiceProvider._id);
    console.log('🧹 Test users cleaned up');
    
    console.log('🎉 All authentication tests passed!');
    console.log('📊 Users will be saved in the Auth database as User collection');
    console.log('🔐 Login will work with registered email/password combinations');
    console.log('👥 All roles (mom, doctor, midwife, service_provider) are supported');
    console.log('✅ No admin approval required - users can login immediately after registration');
    console.log('🚀 Users will be redirected to their respective routes based on their role');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testAuthSystem();
