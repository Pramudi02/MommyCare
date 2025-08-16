const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure we're connecting to the mommycare database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mommycare';
    
    // If the URI doesn't specify a database, append /mommycare
    const finalURI = mongoURI.includes('/mommycare') ? mongoURI : `${mongoURI}/mommycare`;
    
    const conn = await mongoose.connect(finalURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Create chat collections if they don't exist
    await createChatCollections();
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Function to create chat collections if they don't exist
const createChatCollections = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Check if collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Create Chat collection if it doesn't exist
    if (!collectionNames.includes('chats')) {
      await db.createCollection('chats');
      console.log('✅ Created "chats" collection');
      
      // Create indexes for better performance
      const chatCollection = db.collection('chats');
      await chatCollection.createIndex({ participants: 1 });
      await chatCollection.createIndex({ conversationId: 1 });
      await chatCollection.createIndex({ lastActivity: -1 });
      console.log('✅ Created indexes for "chats" collection');
    }
    
    // Create Message collection if it doesn't exist
    if (!collectionNames.includes('messages')) {
      await db.createCollection('messages');
      console.log('✅ Created "messages" collection');
      
      // Create indexes for better performance
      const messageCollection = db.collection('messages');
      await messageCollection.createIndex({ sender: 1, recipient: 1, createdAt: -1 });
      await messageCollection.createIndex({ recipient: 1, read: 1 });
      console.log('✅ Created indexes for "messages" collection');
    }
    
    // Create User collection if it doesn't exist (for chat-related fields)
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('✅ Created "users" collection');
      
      // Create indexes for chat functionality
      const userCollection = db.collection('users');
      await userCollection.createIndex({ isOnline: 1, lastSeen: -1 });
      await userCollection.createIndex({ status: 1 });
      await userCollection.createIndex({ specialty: 1 });
      console.log('✅ Created indexes for "users" collection');
    }
    
    console.log('🎯 Chat collections are ready!');
    
  } catch (error) {
    console.error('⚠️ Warning: Could not create chat collections:', error.message);
    console.log('💡 Collections may already exist or will be created automatically when first used');
  }
};

module.exports = connectDB;
