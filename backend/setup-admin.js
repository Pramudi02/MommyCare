const mongoose = require('mongoose');
require('dotenv').config();

// Import database configuration
const { connectDB } = require('./src/config/database');

// Import the AdminUser model
const getAdminUserModel = require('./src/models/AdminUser');

async function setupAdmin() {
  try {
    console.log('Setting up default admin user...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Get the AdminUser model
    const AdminUser = getAdminUserModel();
    
    // Check if admin user already exists
    const existingAdmin = await AdminUser.findOne({ 
      email: 'testadmin@mommycare.com' 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      return;
    }
    
    // Create default admin user
    const adminData = {
      username: 'testadmin',
      email: 'testadmin@mommycare.com',
      password: '123456',
      role: 'super_admin',
      permissions: [
        'user_management',
        'system_config',
        'audit_logs',
        'database_admin'
      ],
      isActive: true
    };
    
    const adminUser = await AdminUser.create(adminData);
    
    console.log('✅ Default admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Username:', adminUser.username);
    console.log('Password: 123456');
    console.log('Role:', adminUser.role);
    console.log('\nYou can now login at /admin/login');
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    
    if (error.code === 11000) {
      console.log('Admin user already exists with this email/username');
    } else if (error.name === 'ValidationError') {
      console.log('Validation error:', error.message);
    } else {
      console.log('Database connection or other error');
    }
  } finally {
    // Close the mongoose connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
}

// Run the setup
setupAdmin().then(() => {
  console.log('Setup completed');
  process.exit(0);
}).catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
