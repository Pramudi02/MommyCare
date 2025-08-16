const mongoose = require('mongoose');

// Database connection instances
let authConnection = null;
let mommyCareDataConnection = null;
let testConnection = null;

const connectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI;
    
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
      bufferCommands: false,
      autoIndex: false
    };
    
    // Connect to Auth database (for user authentication)
    const authDbUri = baseUri.endsWith('/') 
      ? `${baseUri}Auth` 
      : `${baseUri}/Auth`;
    
    authConnection = await mongoose.createConnection(authDbUri, connectionOptions);

    console.log(`✅ Auth Database Connected: ${authConnection.host}`);
    console.log(`📊 Auth Database: ${authConnection.name}`);
    
    // Connect to MommyCareData database (for main application data)
    const mommyCareDataUri = baseUri.endsWith('/') 
      ? `${baseUri}MommyCareData` 
      : `${baseUri}/MommyCareData`;
    
    mommyCareDataConnection = await mongoose.createConnection(mommyCareDataUri, connectionOptions);

    console.log(`✅ MommyCareData Database Connected: ${mommyCareDataConnection.host}`);
    console.log(`📊 MommyCareData Database: ${mommyCareDataConnection.name}`);
    
    // Connect to Test database (for testing and development)
    const testDbUri = baseUri.endsWith('/') 
      ? `${baseUri}test` 
      : `${baseUri}/test`;
    
    testConnection = await mongoose.createConnection(testDbUri, connectionOptions);

    console.log(`✅ Test Database Connected: ${testConnection.host}`);
    console.log(`📊 Test Database: ${testConnection.name}`);
    
    // Handle connection events for all connections
    [authConnection, mommyCareDataConnection, testConnection].forEach(conn => {
      conn.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
        // Don't crash the server on connection errors
      });

      conn.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      conn.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await Promise.all([
          authConnection.close(),
          mommyCareDataConnection.close(),
          testConnection.close()
        ]);
        console.log('All MongoDB connections closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing connections:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Get database connections
const getAuthConnection = () => authConnection;
const getMommyCareDataConnection = () => mommyCareDataConnection;
const getTestConnection = () => testConnection;

module.exports = {
  connectDB,
  getAuthConnection,
  getMommyCareDataConnection,
  getTestConnection
};
