const mongoose = require('mongoose');
const getUserModel = require('../models/User');
require('dotenv').config();

const initDatabase = async () => {
  try {
    console.log('🔧 Initializing Auth Database...');
    
    // Wait a bit for connections to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get the User model
    const User = getUserModel();
    
    // Check if connection is ready
    if (!User.db || User.db.readyState !== 1) {
      console.log('⚠️ Database connection not ready, skipping initialization');
      return;
    }
    
    // Create indexes for better performance
    try {
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ role: 1 });
      await User.collection.createIndex({ createdAt: 1 });
      console.log('✅ Database indexes created successfully');
    } catch (indexError) {
      console.log('⚠️ Index creation failed, continuing without indexes:', indexError.message);
    }
    
    // Create a test admin user if it doesn't exist
    try {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const adminUser = new User({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@mommycare.com',
          password: 'admin123456',
          role: 'admin',
          isEmailVerified: true,
          isActive: true
        });
        
        await adminUser.save();
        console.log('✅ Admin user created successfully');
      } else {
        console.log('ℹ️ Admin user already exists');
      }
    } catch (userError) {
      console.log('⚠️ Admin user creation failed:', userError.message);
    }
    
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    // Don't throw error, just log it and continue
    console.log('⚠️ Continuing without database initialization...');
  }
};

module.exports = initDatabase;

