require('dotenv').config();
const { connectDB, getAdminConnection } = require('./src/config/database');
const getAdminUserModel = require('./src/models/AdminUser');

async function testAdminAuth() {
  try {
    console.log('🔌 Testing admin authentication system...');
    
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
    console.log('📝 Testing admin user creation...');
    
    // Create a test super admin user
    const testSuperAdmin = await AdminUser.create({
      username: 'superadmin',
      email: 'superadmin@mommycare.com',
      password: 'admin123',
      role: 'super_admin',
      permissions: ['user_management', 'system_config', 'audit_logs', 'database_admin']
    });
    
    console.log('✅ Super admin created successfully:', {
      id: testSuperAdmin._id,
      username: testSuperAdmin.username,
      email: testSuperAdmin.email,
      role: testSuperAdmin.role,
      permissions: testSuperAdmin.permissions
    });
    
    // Create a test regular admin user
    const testAdmin = await AdminUser.create({
      username: 'admin',
      email: 'admin@mommycare.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['user_management', 'system_config']
    });
    
    console.log('✅ Regular admin created successfully:', {
      id: testAdmin._id,
      username: testAdmin.username,
      email: testAdmin.email,
      role: testAdmin.role,
      permissions: testAdmin.permissions
    });
    
    // Create a test moderator
    const testModerator = await AdminUser.create({
      username: 'moderator',
      email: 'moderator@mommycare.com',
      password: 'admin123',
      role: 'moderator',
      permissions: ['user_management']
    });
    
    console.log('✅ Moderator created successfully:', {
      id: testModerator._id,
      username: testModerator.username,
      email: testModerator.email,
      role: testModerator.role,
      permissions: testModerator.permissions
    });
    
    // Test password verification
    const isSuperAdminPasswordMatch = await testSuperAdmin.matchPassword('admin123');
    console.log('🔐 Super admin password verification test:', isSuperAdminPasswordMatch ? 'PASSED' : 'FAILED');
    
    const isAdminPasswordMatch = await testAdmin.matchPassword('admin123');
    console.log('🔐 Admin password verification test:', isAdminPasswordMatch ? 'PASSED' : 'FAILED');
    
    const isModeratorPasswordMatch = await testModerator.matchPassword('admin123');
    console.log('🔐 Moderator password verification test:', isModeratorPasswordMatch ? 'PASSED' : 'FAILED');
    
    // Test user retrieval by role
    const superAdmins = await AdminUser.find({ role: 'super_admin' });
    const admins = await AdminUser.find({ role: 'admin' });
    const moderators = await AdminUser.find({ role: 'moderator' });
    
    console.log('🔍 Admin user retrieval test:', {
      superAdmins: superAdmins.length,
      admins: admins.length,
      moderators: moderators.length
    });
    
    // Test JWT token generation
    const superAdminToken = testSuperAdmin.getSignedJwtToken();
    const adminToken = testAdmin.getSignedJwtToken();
    const moderatorToken = testModerator.getSignedJwtToken();
    
    console.log('🎫 JWT token generation test:', {
      superAdminToken: superAdminToken ? 'PASSED' : 'FAILED',
      adminToken: adminToken ? 'PASSED' : 'FAILED',
      moderatorToken: moderatorToken ? 'PASSED' : 'FAILED'
    });
    
    // Test token payload
    const jwt = require('jsonwebtoken');
    const decodedSuperAdmin = jwt.decode(superAdminToken);
    console.log('🔍 Super admin token payload:', {
      id: decodedSuperAdmin.id,
      role: decodedSuperAdmin.role,
      email: decodedSuperAdmin.email,
      username: decodedSuperAdmin.username,
      isAdmin: decodedSuperAdmin.isAdmin
    });
    
    // Clean up test admin users
    await AdminUser.findByIdAndDelete(testSuperAdmin._id);
    await AdminUser.findByIdAndDelete(testAdmin._id);
    await AdminUser.findByIdAndDelete(testModerator._id);
    console.log('🧹 Test admin users cleaned up');
    
    console.log('\n🎉 Admin authentication system test completed successfully!');
    console.log('\n📋 Admin System Features:');
    console.log('   🔐 Admin users stored in Admin database');
    console.log('   👑 Three admin roles: super_admin, admin, moderator');
    console.log('   🔑 Granular permissions system');
    console.log('   🎫 JWT tokens with admin-specific payload');
    console.log('   🚀 Ready for admin panel integration');
    
    console.log('\n🌐 API Endpoints Available:');
    console.log('   POST /api/admin/register - Register new admin');
    console.log('   POST /api/admin/login - Admin login');
    console.log('   GET /api/admin/me - Get admin profile');
    console.log('   PUT /api/admin/profile - Update admin profile');
    console.log('   PUT /api/admin/password - Change admin password');
    console.log('   GET /api/admin/test-db - Test admin database');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Admin authentication test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testAdminAuth();
