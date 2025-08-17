const mongoose = require('mongoose');

// ⚠️  SECURITY WARNING: This file contains hardcoded database credentials
// This is NOT recommended for production. Use environment variables instead.
// TODO: Remove hardcoded credentials and use only environment variables

// Single database connection
let connection = null;

const connectDB = async () => {
  try {
    // Try environment variable first, fallback to hardcoded URL
    let uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.log('⚠️  MONGODB_URI not found in environment, using hardcoded fallback');
      uri = 'mongodb+srv://pramupiyumika:Mommycare123new@mommycarecluster.noiaord.mongodb.net/mommycare?retryWrites=true&w=majority&appName=MommyCareCluster';
    }
    
    // Set JWT secret fallback if not provided
    if (!process.env.JWT_SECRET) {
      console.log('⚠️  JWT_SECRET not found in environment, using fallback');
      process.env.JWT_SECRET = 'fallback-secret-key-for-development-only';
    }
    
    // Enhanced connection options for Node.js 22 + MongoDB Atlas compatibility
    const connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      // SSL/TLS options for Node.js 22 compatibility
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      // Additional options for stability
      bufferCommands: true,
      autoIndex: false
    };
    
    console.log('🔌 Connecting to database...');
    
    // Connect to the single database
    connection = await mongoose.connect(uri, connectionOptions);
    console.log(`✅ Database Connected: ${connection.connection.host}`);
    console.log(`📊 Database: ${connection.connection.name}`);
    
    // Handle connection events
    connection.connection.on('error', (err) => {
      console.error(`❌ Database connection error:`, err.message);
    });

    connection.connection.on('disconnected', () => {
      console.log(`⚠️ Database disconnected`);
    });

    connection.connection.on('reconnected', () => {
      console.log(`🔄 Database reconnected`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await connection.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing connection:', error);
        process.exit(1);
      }
    });

    console.log('🎉 Database connected successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Get database connection
const getConnection = () => connection;

// For backward compatibility, keep the old function names but they all return the same connection
const getAuthConnection = () => connection;
const getAdminConnection = () => connection;
const getLocalConnection = () => connection;
const getTestConnection = () => connection;
const getConfigConnection = () => connection;

module.exports = {
  connectDB,
  getConnection,
  getAuthConnection,
  getAdminConnection,
  getLocalConnection,
  getTestConnection,
  getConfigConnection
};
