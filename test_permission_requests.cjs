const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mommycare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import models
const PermissionRequest = require('./backend/src/models/PermissionRequest');
const User = require('./backend/src/models/User');

async function testPermissionRequests() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check if we have any users
    const users = await User.find({}).limit(5);
    console.log(`Found ${users.length} users in database`);
    
    if (users.length > 0) {
      console.log('Sample users:', users.map(u => ({ id: u._id, email: u.email, role: u.role })));
    }
    
    // Check if we have any permission requests
    const requests = await PermissionRequest.find({}).populate('user', 'firstName lastName email role');
    console.log(`Found ${requests.length} permission requests in database`);
    
    if (requests.length > 0) {
      console.log('Sample requests:', requests.map(r => ({
        id: r._id,
        user: r.user?.email,
        role: r.userRole,
        status: r.status,
        submittedAt: r.submittedAt
      })));
    } else {
      console.log('No permission requests found. Creating test data...');
      
      // Create test permission requests if we have users
      if (users.length > 0) {
        const testUser = users[0];
        
        // Create a doctor permission request
        const doctorRequest = new PermissionRequest({
          user: testUser._id,
          userRole: 'doctor',
          status: 'pending',
          hospitalName: 'Test Hospital',
          doctorSpecialization: 'Obstetrics',
          licenseNumber: 'DOC123456',
          yearsOfExperience: 5,
          submittedAt: new Date()
        });
        
        await doctorRequest.save();
        console.log('✅ Created test doctor permission request');
        
        // Create a midwife permission request
        const midwifeRequest = new PermissionRequest({
          user: testUser._id,
          userRole: 'midwife',
          status: 'pending',
          midwifeLicenseNumber: 'MID789012',
          midwifeExperience: '3 years',
          phmArea: 'Test PHM Area',
          mohArea: 'Test MOH Area',
          submittedAt: new Date()
        });
        
        await midwifeRequest.save();
        console.log('✅ Created test midwife permission request');
        
        // Create a service provider permission request
        const serviceRequest = new PermissionRequest({
          user: testUser._id,
          userRole: 'service_provider',
          status: 'pending',
          businessName: 'Test Business',
          businessType: 'Healthcare Services',
          businessLicense: 'BUS345678',
          serviceCategories: ['Prenatal Care', 'Postnatal Care'],
          submittedAt: new Date()
        });
        
        await serviceRequest.save();
        console.log('✅ Created test service provider permission request');
        
        console.log('🎉 Test data created successfully!');
      } else {
        console.log('❌ No users found to create test permission requests');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing permission requests:', error);
  } finally {
    mongoose.connection.close();
  }
}

testPermissionRequests();

