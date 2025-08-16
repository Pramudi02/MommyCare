const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Store online users and their socket IDs
const onlineUsers = new Map();
const userSockets = new Map();

// Initialize chat socket functionality
const initializeChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user joining
    socket.on('join', async (userId) => {
      try {
        // Store user's socket connection
        userSockets.set(userId, socket.id);
        onlineUsers.set(socket.id, userId);
        
        // Join user to their personal room
        socket.join(`user_${userId}`);
        
        // Update user's online status
        await User.findByIdAndUpdate(userId, { 
          isOnline: true,
          lastSeen: new Date()
        });
        
        // Notify other users about this user coming online
        socket.broadcast.emit('user_status_change', {
          userId,
          status: 'online'
        });
        
        console.log(`User ${userId} joined chat`);
      } catch (error) {
        console.error('Error in join event:', error);
      }
    });

    // Handle user leaving
    socket.on('leave', async (userId) => {
      try {
        // Remove user from online tracking
        userSockets.delete(userId);
        onlineUsers.delete(socket.id);
        
        // Update user's offline status
        await User.findByIdAndUpdate(userId, { 
          isOnline: false,
          lastSeen: new Date()
        });
        
        // Notify other users about this user going offline
        socket.broadcast.emit('user_status_change', {
          userId,
          status: 'offline'
        });
        
        console.log(`User ${userId} left chat`);
      } catch (error) {
        console.error('Error in leave event:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { conversationId, userId } = data;
      
      // Emit typing indicator to other participants in the conversation
      socket.to(`conversation_${conversationId}`).emit('typing_indicator', {
        conversationId,
        userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { conversationId, userId } = data;
      
      // Emit typing stop indicator
      socket.to(`conversation_${conversationId}`).emit('typing_indicator', {
        conversationId,
        userId,
        isTyping: false
      });
    });

    // Handle joining conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle message delivery confirmation
    socket.on('message_delivered', async (data) => {
      try {
        const { messageId, conversationId } = data;
        
        // Find the message and update its status
        const message = await Message.findById(messageId);
        if (message) {
          // Verify this message belongs to the conversation
          if (message.conversationId === conversationId) {
            await Message.findByIdAndUpdate(messageId, { 
              status: 'delivered' 
            });
            
            // Emit delivery confirmation to sender
            socket.to(`conversation_${conversationId}`).emit('message_status_update', {
              messageId,
              status: 'delivered'
            });
          }
        }
      } catch (error) {
        console.error('Error in message_delivered event:', error);
      }
    });

    // Handle message read confirmation
    socket.on('message_read', async (data) => {
      try {
        const { messageId, conversationId } = data;
        
        // Find the message and update its status
        const message = await Message.findById(messageId);
        if (message) {
          // Verify this message belongs to the conversation
          if (message.conversationId === conversationId) {
            await Message.findByIdAndUpdate(messageId, { 
              status: 'read',
              readAt: new Date()
            });
            
            // Emit read confirmation to sender
            socket.to(`conversation_${conversationId}`).emit('message_status_update', {
              messageId,
              status: 'read'
            });
          }
        }
      } catch (error) {
        console.error('Error in message_read event:', error);
      }
    });

    // Handle user away status
    socket.on('user_away', async (userId) => {
      try {
        await User.findByIdAndUpdate(userId, { 
          isOnline: false,
          status: 'away',
          lastSeen: new Date()
        });
        
        socket.broadcast.emit('user_status_change', {
          userId,
          status: 'away'
        });
      } catch (error) {
        console.error('Error in user_away event:', error);
      }
    });

    // Handle user back status
    socket.on('user_back', async (userId) => {
      try {
        await User.findByIdAndUpdate(userId, { 
          isOnline: true,
          status: 'online',
          lastSeen: new Date()
        });
        
        socket.broadcast.emit('user_status_change', {
          userId,
          status: 'online'
        });
      } catch (error) {
        console.error('Error in user_back event:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        const userId = onlineUsers.get(socket.id);
        
        if (userId) {
          // Update user's offline status
          await User.findByIdAndUpdate(userId, { 
            isOnline: false,
            lastSeen: new Date()
          });
          
          // Remove from tracking
          userSockets.delete(userId);
          onlineUsers.delete(socket.id);
          
          // Notify other users
          socket.broadcast.emit('user_status_change', {
            userId,
            status: 'offline'
          });
          
          console.log(`User ${userId} disconnected`);
        }
        
        console.log('Client disconnected:', socket.id);
      } catch (error) {
        console.error('Error in disconnect event:', error);
      }
    });
  });
};

// Helper function to emit message to specific user
const emitToUser = (io, userId, event, data) => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Helper function to emit to conversation participants
const emitToConversation = (io, conversationId, event, data) => {
  io.to(`conversation_${conversationId}`).emit(event, data);
};

// Helper function to check if user is online
const isUserOnline = (userId) => {
  return userSockets.has(userId);
};

// Helper function to get online users count
const getOnlineUsersCount = () => {
  return onlineUsers.size;
};

module.exports = {
  initializeChatSocket,
  emitToUser,
  emitToConversation,
  isUserOnline,
  getOnlineUsersCount
};
