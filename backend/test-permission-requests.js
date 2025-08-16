require('dotenv').config();
const { connectDB, getAdminConnection } = require('./src/config/database');
const getPermissionRequestModel = require('./src/models/PermissionRequest');
const getUserModel = require('./src/models/User');

async function testPermissionRequests() {
  try {
    console.log('🔌 Testing permission request system...');
    
    // Connect to all databases
    await connectDB();
    console.log('✅ All databases connected successfully!');
    
    // Test admin database connection
    const adminConnection = getAdminConnection();
    if (!adminConnection) {
      throw new Error('Admin database connection not available');
    }
    console.log('✅ Admin database connection verified');
    
    // Test permission request model
    const PermissionRequest = getPermissionRequestModel();
    console.log('📝 Testing permission request creation...');
    
    // Create test permission requests for each role
    const testRequests = [
      {
        userId: 'test_doctor_123',
        userEmail: 'doctor@test.com',
        userRole: 'doctor',
        requestType: 'permission_request',
        status: 'pending',
        documents: [
          { name: 'Medical License', url: 'https://example.com/license.pdf', type: 'pdf' },
          { name: 'Education Certificate', url: 'https://example.com/education.pdf', type: 'pdf' }
        ],
        requestDetails: {
          specialization: 'Cardiology',
          licenseNumber: 'MD123456',
          hospital: 'City General Hospital',
          experience: 8,
          education: ['MBBS', 'MD Cardiology'],
          certifications: ['Board Certified Cardiologist', 'ACLS Certified'],
          additionalInfo: 'Experienced cardiologist with focus on maternal heart health',
          reason: 'Seeking permission to provide specialized cardiac care for pregnant women'
        },
        priority: 'high',
        isUrgent: false
      },
      {
        userId: 'test_midwife_456',
        userEmail: 'midwife@test.com',
        userRole: 'midwife',
        requestType: 'permission_request',
        status: 'pending',
        documents: [
          { name: 'Midwifery Certification', url: 'https://example.com/midwife_cert.pdf', type: 'pdf' },
          { name: 'Clinical Experience', url: 'https://example.com/experience.pdf', type: 'pdf' }
        ],
        requestDetails: {
          certificationNumber: 'MW789012',
          clinic: 'Maternal Care Clinic',
          experience: 12,
          services: ['Prenatal Care', 'Labor Support', 'Postpartum Care', 'Lactation Support'],
          additionalInfo: 'Certified midwife with extensive experience in home births and natural deliveries',
          reason: 'Requesting permission to provide comprehensive midwifery services'
        },
        priority: 'medium',
        isUrgent: false
      },
      {
        userId: 'test_service_provider_789',
        userEmail: 'service@test.com',
        userRole: 'service_provider',
        requestType: 'permission_request',
        status: 'pending',
        documents: [
          { name: 'Business Registration', url: 'https://example.com/business_reg.pdf', type: 'pdf' },
          { name: 'Service Portfolio', url: 'https://example.com/portfolio.pdf', type: 'pdf' }
        ],
        requestDetails: {
          businessName: 'MommyCare Services Ltd',
          businessType: 'Healthcare Services',
          registrationNumber: 'SP345678',
          businessServices: ['Medical Equipment Rental', 'Home Healthcare', 'Nutrition Consultation', 'Baby Products'],
          additionalInfo: 'Established healthcare service provider specializing in maternal and infant care',
          reason: 'Seeking permission to offer comprehensive maternal and infant care services'
        },
        priority: 'medium',
        isUrgent: false
      }
    ];
    
    // Create all test requests
    const createdRequests = [];
    for (const requestData of testRequests) {
      const request = await PermissionRequest.create(requestData);
      createdRequests.push(request);
      console.log(`✅ ${requestData.userRole} permission request created:`, request._id);
    }
    
    // Test querying requests by role
    const doctorRequests = await PermissionRequest.getByRole('doctor');
    const midwifeRequests = await PermissionRequest.getByRole('midwife');
    const serviceProviderRequests = await PermissionRequest.getByRole('service_provider');
    
    console.log('🔍 Role-based querying test:', {
      doctor: doctorRequests.length,
      midwife: midwifeRequests.length,
      serviceProvider: serviceProviderRequests.length
    });
    
    // Test querying by status
    const pendingRequests = await PermissionRequest.getByStatus('pending');
    console.log('📊 Status-based querying test:', {
      pending: pendingRequests.length
    });
    
    // Test urgent requests
    const urgentRequests = await PermissionRequest.getUrgentRequests();
    console.log('🚨 Urgent requests test:', {
      urgent: urgentRequests.length
    });
    
    // Test updating a request
    const firstRequest = createdRequests[0];
    const updatedRequest = await PermissionRequest.findByIdAndUpdate(
      firstRequest._id,
      { 
        $set: { 
          'requestDetails.additionalInfo': 'Updated information for testing',
          priority: 'urgent',
          isUrgent: true
        } 
      },
      { new: true }
    );
    console.log('✏️ Request update test:', updatedRequest.priority === 'urgent' ? 'PASSED' : 'FAILED');
    
    // Test request age calculation
    const requestAge = updatedRequest.requestAge;
    console.log('⏰ Request age calculation test:', requestAge >= 0 ? 'PASSED' : 'FAILED');
    
    // Clean up test requests
    for (const request of createdRequests) {
      await PermissionRequest.findByIdAndDelete(request._id);
    }
    console.log('🧹 Test permission requests cleaned up');
    
    console.log('\n🎉 Permission request system test completed successfully!');
    console.log('\n📋 Permission Request System Features:');
    console.log('   🔐 Permission requests stored in Admin database');
    console.log('   👨‍⚕️ Doctor-specific fields: specialization, license, hospital, experience');
    console.log('   👩‍⚕️ Midwife-specific fields: certification, clinic, services');
    console.log('   🏢 Service provider fields: business details, services');
    console.log('   📊 Status tracking: pending, approved, rejected, under_review');
    console.log('   🚨 Priority levels: low, medium, high, urgent');
    console.log('   📄 Document upload support');
    console.log('   📝 Admin notes and review system');
    
    console.log('\n🌐 API Endpoints Available:');
    console.log('   POST /api/permission-requests/:role/permission-request - Submit request');
    console.log('   GET /api/permission-requests/:role/permission-requests - Get user requests');
    console.log('   GET /api/permission-requests/:role/permission-request/:id - Get specific request');
    console.log('   PUT /api/permission-requests/:role/permission-request/:id - Update request');
    console.log('   DELETE /api/permission-requests/:role/permission-request/:id - Cancel request');
    console.log('   GET /api/permission-requests/test - Test system');
    
    console.log('\n🎯 Supported Roles:');
    console.log('   👨‍⚕️ doctor - Medical professionals');
    console.log('   👩‍⚕️ midwife - Midwifery professionals');
    console.log('   🏢 service_provider - Healthcare service businesses');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Permission request test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testPermissionRequests();
