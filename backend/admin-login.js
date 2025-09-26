const mongoose = require('mongoose');
require('dotenv').config();

// Import database configuration
const { connectDB } = require('./src/config/database');

// Import the AdminUser model
const getAdminUserModel = require('./src/models/AdminUser');

async function adminLogin() {
  try {
    console.log('🔐 Admin Login...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Get the AdminUser model
    const AdminUser = getAdminUserModel();
    
    // Find admin user
    const adminUser = await AdminUser.findOne({ 
      email: 'testadmin@mommycare.com' 
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', adminUser.email);
    console.log('Username:', adminUser.username);
    console.log('Role:', adminUser.role);
    
    // Check password
    const isPasswordValid = await adminUser.matchPassword('123456');
    
    if (isPasswordValid) {
      console.log('✅ Password is valid');
      
      // Generate JWT token
      const token = adminUser.getSignedJwtToken();
      console.log('\n🔑 JWT Token:');
      console.log(token);
      console.log('\n📋 Use this token in the Authorization header:');
      console.log(`Bearer ${token}`);
      
    } else {
      console.log('❌ Invalid password');
    }
    
  } catch (error) {
    console.error('❌ Error during admin login:', error.message);
  } finally {
    // Close the mongoose connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
}

// Run the login
adminLogin().then(() => {
  console.log('Login completed');
  process.exit(0);
}).catch((error) => {
  console.error('Login failed:', error);
  process.exit(1);
});
