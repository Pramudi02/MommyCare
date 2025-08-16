const mongoose = require('mongoose');

// Database connection instances for all 5 databases
let authConnection = null;
let adminConnection = null;
let localConnection = null;
let testConnection = null;
let configConnection = null;

const connectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI;
    
    if (!baseUri) {
      throw new Error('MONGODB_URI environment variable is required');
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
    
    console.log('🔌 Connecting to all databases...');
    
    // 1. Connect to Auth database (for user authentication)
    const authDbUri = baseUri.endsWith('/') 
      ? `${baseUri}Auth` 
      : `${baseUri}/Auth`;
    
    authConnection = await mongoose.createConnection(authDbUri, connectionOptions);
    console.log(`✅ Auth Database Connected: ${authConnection.host}`);
    console.log(`📊 Auth Database: ${authConnection.name}`);
    
    // 2. Connect to Admin database (for system administration)
    const adminDbUri = baseUri.endsWith('/') 
      ? `${baseUri}admin` 
      : `${baseUri}/admin`;
    
    adminConnection = await mongoose.createConnection(adminDbUri, connectionOptions);
    console.log(`✅ Admin Database Connected: ${adminConnection.host}`);
    console.log(`📊 Admin Database: ${adminConnection.name}`);
    
    // 3. Connect to Local database (for development)
    const localDbUri = baseUri.endsWith('/') 
      ? `${baseUri}local` 
      : `${baseUri}/local`;
    
    localConnection = await mongoose.createConnection(localDbUri, connectionOptions);
    console.log(`✅ Local Database Connected: ${localConnection.host}`);
    console.log(`📊 Local Database: ${localConnection.name}`);
    
    // 4. Connect to Test database (for testing)
    const testDbUri = baseUri.endsWith('/') 
      ? `${baseUri}test` 
      : `${baseUri}/test`;
    
    testConnection = await mongoose.createConnection(testDbUri, connectionOptions);
    console.log(`✅ Test Database Connected: ${testConnection.host}`);
    console.log(`📊 Test Database: ${testConnection.name}`);
    
    // 5. Connect to Config database (for MongoDB configuration)
    const configDbUri = baseUri.endsWith('/') 
      ? `${baseUri}config` 
      : `${baseUri}/config`;
    
    configConnection = await mongoose.createConnection(configDbUri, connectionOptions);
    console.log(`✅ Config Database Connected: ${configConnection.host}`);
    console.log(`📊 Config Database: ${configConnection.name}`);
    
    // Handle connection events for all connections
    [authConnection, adminConnection, localConnection, testConnection, configConnection].forEach(conn => {
      if (conn) {
        conn.on('error', (err) => {
          console.error(`❌ Database connection error (${conn.name}):`, err.message);
        });

        conn.on('disconnected', () => {
          console.log(`⚠️ Database disconnected: ${conn.name}`);
        });

        conn.on('reconnected', () => {
          console.log(`🔄 Database reconnected: ${conn.name}`);
        });
      }
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await Promise.all([
          authConnection?.close(),
          adminConnection?.close(),
          localConnection?.close(),
          testConnection?.close(),
          configConnection?.close()
        ].filter(Boolean));
        console.log('All MongoDB connections closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing connections:', error);
        process.exit(1);
      }
    });

    console.log('🎉 All 5 databases connected successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Get database connections
const getAuthConnection = () => authConnection;
const getAdminConnection = () => adminConnection;
const getLocalConnection = () => localConnection;
const getTestConnection = () => testConnection;
const getConfigConnection = () => configConnection;

module.exports = {
  connectDB,
  getAuthConnection,
  getAdminConnection,
  getLocalConnection,
  getTestConnection,
  getConfigConnection
};
