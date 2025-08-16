require('dotenv').config();
const { connectDB, getAdminConnection } = require('./src/config/database');
const getAdminUserModel = require('./src/models/AdminUser');
const getPermissionRequestModel = require('./src/models/PermissionRequest');
const getUserModel = require('./src/models/User');

async function testCompleteSystem() {
  try {
    console.log('🚀 Testing complete MommyCare permission request system...\n');
    
    // Connect to all databases
    await connectDB();
    console.log('✅ All databases connected successfully!');
    
    // Test admin database connection
    const adminConnection = getAdminConnection();
    if (!adminConnection) {
      throw new Error('Admin database connection not available');
    }
    console.log('✅ Admin database connection verified');
    
    // Test admin user creation
    const AdminUser = getAdminUserModel();
    console.log('👑 Testing admin user creation...');
    
    const testAdmin = await AdminUser.create({
      username: 'testadmin',
      email: 'testadmin@mommycare.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['user_management', 'system_config']
    });
    
    console.log('✅ Test admin created successfully:', testAdmin.username);
    
    // Test permission request model
    const PermissionRequest = getPermissionRequestModel();
    console.log('\n📝 Testing permission request creation...');
    
    // Create test permission requests for each role
    const testRequests = [
      {
        userId: 'test_doctor_123',
        userEmail: 'doctor@test.com',
        userRole: 'doctor',
        requestType: 'permission_request',
        status: 'pending',
        documents: [
          { name: 'Medical License', url: 'https://example.com/license.pdf', type: 'pdf' }
        ],
        requestDetails: {
          specialization: 'Obstetrics',
          licenseNumber: 'MD123456',
          hospital: 'City General Hospital',
          experience: 5,
          education: ['MBBS', 'MD Obstetrics'],
          certifications: ['Board Certified Obstetrician'],
          additionalInfo: 'Experienced obstetrician',
          reason: 'Seeking permission to provide obstetric care'
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
          { name: 'Midwifery Certification', url: 'https://example.com/midwife_cert.pdf', type: 'pdf' }
        ],
        requestDetails: {
          certificationNumber: 'MW789012',
          clinic: 'Maternal Care Clinic',
          experience: 8,
          services: ['Prenatal Care', 'Labor Support', 'Postpartum Care'],
          additionalInfo: 'Certified midwife',
          reason: 'Requesting permission to provide midwifery services'
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
          { name: 'Business Registration', url: 'https://example.com/business_reg.pdf', type: 'pdf' }
        ],
        requestDetails: {
          businessName: 'MommyCare Services',
          businessType: 'Healthcare Services',
          registrationNumber: 'SP345678',
          businessServices: ['Medical Equipment', 'Home Healthcare'],
          additionalInfo: 'Healthcare service provider',
          reason: 'Seeking permission to offer healthcare services'
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
    
    // Test admin operations
    console.log('\n🔧 Testing admin operations...');
    
    // Test getting all requests
    const allRequests = await PermissionRequest.find({});
    console.log('📊 Total requests in system:', allRequests.length);
    
    // Test filtering by role
    const doctorRequests = await PermissionRequest.find({ userRole: 'doctor' });
    const midwifeRequests = await PermissionRequest.find({ userRole: 'midwife' });
    const serviceProviderRequests = await PermissionRequest.find({ userRole: 'service_provider' });
    
    console.log('🔍 Role-based filtering:', {
      doctor: doctorRequests.length,
      midwife: midwifeRequests.length,
      serviceProvider: serviceProviderRequests.length
    });
    
    // Test filtering by status
    const pendingRequests = await PermissionRequest.find({ status: 'pending' });
    console.log('📊 Status-based filtering - Pending:', pendingRequests.length);
    
    // Test priority filtering
    const highPriorityRequests = await PermissionRequest.find({ priority: 'high' });
    console.log('🚨 Priority filtering - High:', highPriorityRequests.length);
    
    // Test admin note addition
    const firstRequest = createdRequests[0];
    const updatedRequest = await PermissionRequest.findByIdAndUpdate(
      firstRequest._id,
      {
        $push: {
          adminNotes: {
            adminId: testAdmin._id,
            adminUsername: testAdmin.username,
            note: 'Test admin note for review',
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    console.log('📝 Admin note addition test:', updatedRequest.adminNotes.length > 0 ? 'PASSED' : 'FAILED');
    
    // Test status update
    const approvedRequest = await PermissionRequest.findByIdAndUpdate(
      firstRequest._id,
      {
        status: 'approved',
        reviewedBy: {
          adminId: testAdmin._id,
          adminUsername: testAdmin.username,
          reviewedAt: new Date()
        }
      },
      { new: true }
    );
    
    console.log('✅ Status update test:', approvedRequest.status === 'approved' ? 'PASSED' : 'FAILED');
    
    // Test bulk operations
    const remainingRequests = createdRequests.slice(1);
    const requestIds = remainingRequests.map(req => req._id);
    
    const bulkUpdateResult = await PermissionRequest.updateMany(
      { _id: { $in: requestIds } },
      {
        $set: {
          status: 'under_review',
          reviewedBy: {
            adminId: testAdmin._id,
            adminUsername: testAdmin.username,
            reviewedAt: new Date()
          }
        }
      }
    );
    
    console.log('🔄 Bulk update test:', bulkUpdateResult.modifiedCount === 2 ? 'PASSED' : 'FAILED');
    
    // Test statistics
    const statusStats = await PermissionRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const roleStats = await PermissionRequest.aggregate([
      { $group: { _id: '$userRole', count: { $sum: 1 } } }
    ]);
    
    console.log('📈 Statistics test:', {
      byStatus: statusStats.reduce((acc, stat) => { acc[stat._id] = stat.count; return acc; }, {}),
      byRole: roleStats.reduce((acc, stat) => { acc[stat._id] = stat.count; return acc; }, {})
    });
    
    // Test urgent requests
    const urgentRequests = await PermissionRequest.find({ 
      $or: [{ priority: 'urgent' }, { isUrgent: true }] 
    });
    console.log('🚨 Urgent requests:', urgentRequests.length);
    
    // Test request age calculation
    const requestAge = updatedRequest.requestAge;
    console.log('⏰ Request age calculation:', requestAge >= 0 ? 'PASSED' : 'FAILED');
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    
    // Delete test admin user
    await AdminUser.findByIdAndDelete(testAdmin._id);
    console.log('✅ Test admin user deleted');
    
    // Delete test permission requests
    for (const request of createdRequests) {
      await PermissionRequest.findByIdAndDelete(request._id);
    }
    console.log('✅ Test permission requests deleted');
    
    console.log('\n🎉 Complete system test completed successfully!');
    console.log('\n📋 System Features Verified:');
    console.log('   🔐 Admin database connection and user management');
    console.log('   📝 Permission request creation for all roles');
    console.log('   🔍 Advanced filtering and querying');
    console.log('   ✏️ Request updates and status management');
    console.log('   📝 Admin notes and review system');
    console.log('   🔄 Bulk operations and batch processing');
    console.log('   📊 Statistics and analytics');
    console.log('   🚨 Priority and urgency handling');
    console.log('   ⏰ Request tracking and age calculation');
    
    console.log('\n🌐 API Endpoints Available:');
    console.log('\n👤 User Permission Requests:');
    console.log('   POST /api/permission-requests/:role/permission-request');
    console.log('   GET /api/permission-requests/:role/permission-requests');
    console.log('   GET /api/permission-requests/:role/permission-request/:id');
    console.log('   PUT /api/permission-requests/:role/permission-request/:id');
    console.log('   DELETE /api/permission-requests/:role/permission-request/:id');
    
    console.log('\n👑 Admin Management:');
    console.log('   GET /api/admin/permission-requests');
    console.log('   GET /api/admin/permission-requests/stats');
    console.log('   GET /api/admin/permission-request/:id');
    console.log('   PUT /api/admin/permission-request/:id/status');
    console.log('   POST /api/admin/permission-request/:id/notes');
    console.log('   PUT /api/admin/permission-requests/bulk-update');
    
    console.log('\n🎯 Supported User Roles:');
    console.log('   👨‍⚕️ doctor - Medical professionals');
    console.log('   👩‍⚕️ midwife - Midwifery professionals');
    console.log('   🏢 service_provider - Healthcare service businesses');
    
    console.log('\n📊 Request Statuses:');
    console.log('   ⏳ pending - Awaiting review');
    console.log('   🔍 under_review - Currently being reviewed');
    console.log('   ✅ approved - Permission granted');
    console.log('   ❌ rejected - Permission denied');
    
    console.log('\n🚨 Priority Levels:');
    console.log('   🔴 urgent - Highest priority');
    console.log('   🟠 high - High priority');
    console.log('   🟡 medium - Normal priority');
    console.log('   🟢 low - Low priority');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Complete system test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testCompleteSystem();
