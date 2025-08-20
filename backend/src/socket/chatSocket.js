const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Store active users and their conversations
const activeUsers = new Map(); // userId -> socketId
const userConversations = new Map(); // userId -> Set of conversationIds

// Helper function to emit to a specific user
const emitToUser = (userId, event, data) => {
  const socketId = activeUsers.get(userId);
  if (socketId && global.io) {
    global.io.to(socketId).emit(event, data);
  }
};

// Helper function to emit to all users in a conversation
const emitToConversation = (conversationId, event, data, excludeUserId = null) => {
  if (!global.io) return;
  
  const chat = Chat.findById(conversationId);
  if (chat && chat.participants) {
    chat.participants.forEach(participantId => {
      if (excludeUserId && participantId.toString() === excludeUserId.toString()) return;
      
      const socketId = activeUsers.get(participantId.toString());
      if (socketId) {
        global.io.to(socketId).emit(event, data);
      }
    });
  }
};

// Helper function to emit typing indicator
const emitTypingIndicator = (conversationId, userId, isTyping) => {
  emitToConversation(conversationId, 'typing_indicator', {
    conversationId,
    userId,
    isTyping
  }, userId);
};

// Helper function to emit message status update
const emitMessageStatusUpdate = (conversationId, messageId, status) => {
  emitToConversation(conversationId, 'message_status_update', {
    conversationId,
    messageId,
    status
  });
};

// Helper function to emit new message
const emitNewMessage = (conversationId, message) => {
  emitToConversation(conversationId, 'new_message', {
    conversationId,
    message
  });
};

const setupChatSocket = (io) => {
  // Store io instance globally for use in helper functions
  global.io = io;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User().findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const userRole = socket.userRole;

    console.log(`User ${userId} (${userRole}) connected`);

    // Store active user
    activeUsers.set(userId, socket.id);

    // Update user online status
    User().findByIdAndUpdate(userId, { 
      $set: { 
        isOnline: true,
        lastSeen: new Date()
      } 
    }).catch(console.error);

    // Join user's personal room
    socket.join(`user_${userId}`);

    // Emit user online status to all users
    socket.broadcast.emit('user_status_change', {
      userId,
      isOnline: true,
      lastSeen: new Date()
    });

    // Handle joining a conversation
    socket.on('join_conversation', async (conversationId) => {
      try {
        const chat = await Chat.findById(conversationId);
        if (!chat || !chat.participants.includes(userId)) {
          socket.emit('error', { message: 'Conversation not found or access denied' });
          return;
        }

        // Leave previous conversations
        const currentConversations = userConversations.get(userId) || new Set();
        currentConversations.forEach(convId => {
          socket.leave(`conversation_${convId}`);
        });

        // Join new conversation
        socket.join(`conversation_${conversationId}`);
        currentConversations.clear();
        currentConversations.add(conversationId);
        userConversations.set(userId, currentConversations);

        // Mark conversation as read
        await Message.markAllAsRead(conversationId, userId);

        socket.emit('conversation_joined', { conversationId });
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Handle leaving a conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      
      const currentConversations = userConversations.get(userId) || new Set();
      currentConversations.delete(conversationId);
      userConversations.set(userId, currentConversations);
    });

    // Handle typing indicator
    socket.on('typing_start', (data) => {
      const conversationId = typeof data === 'string' ? data : data.conversationId;
      const typingUserId = typeof data === 'string' ? userId : data.userId;
      emitTypingIndicator(conversationId, typingUserId, true);
    });

    socket.on('typing_stop', (data) => {
      const conversationId = typeof data === 'string' ? data : data.conversationId;
      const typingUserId = typeof data === 'string' ? userId : data.userId;
      emitTypingIndicator(conversationId, typingUserId, false);
    });

    // Handle message read
    socket.on('message_read', async (data) => {
      try {
        const { messageId, conversationId } = data;
        
        const message = await Message.findById(messageId);
        if (message && message.recipientId.toString() === userId) {
          message.read = true;
          message.readAt = new Date();
          await message.save();

          // Emit read status to sender
          emitToUser(message.senderId.toString(), 'message_read', {
            messageId,
            conversationId,
            readAt: message.readAt
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user busy status
    socket.on('user_busy', (isBusy) => {
      User().findByIdAndUpdate(userId, { 
        $set: { 
          status: isBusy ? 'busy' : 'available',
          lastSeen: new Date()
        } 
      }).catch(console.error);

      socket.broadcast.emit('user_status_change', {
        userId,
        status: isBusy ? 'busy' : 'available',
        lastSeen: new Date()
      });
    });

    // Handle availability update
    socket.on('update_availability', (availability) => {
      User().findByIdAndUpdate(userId, { 
        $set: { 
          availability,
          lastSeen: new Date()
        } 
      }).catch(console.error);

      socket.broadcast.emit('user_availability_update', {
        userId,
        availability,
        lastSeen: new Date()
      });
    });

    // Handle message reactions
    socket.on('message_reaction_added', async (data) => {
      try {
        const { messageId, emoji } = data;
        const message = await Message.findById(messageId);
        
        if (message) {
          // Remove existing reaction from this user
          message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
          
          // Add new reaction
          message.reactions.push({ userId, emoji });
          await message.save();

          // Emit to conversation participants
          emitToConversation(message.conversationId, 'message_reaction_added', {
            messageId,
            userId,
            emoji,
            reactions: message.reactions
          });
        }
      } catch (error) {
        console.error('Error adding message reaction:', error);
      }
    });

    socket.on('message_reaction_removed', async (data) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId);
        
        if (message) {
          // Remove reaction from this user
          message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
          await message.save();

          // Emit to conversation participants
          emitToConversation(message.conversationId, 'message_reaction_removed', {
            messageId,
            userId,
            reactions: message.reactions
          });
        }
      } catch (error) {
        console.error('Error removing message reaction:', error);
      }
    });

    // Handle message editing
    socket.on('message_edited', async (data) => {
      try {
        const { messageId, newContent } = data;
        const message = await Message.findById(messageId);
        
        if (message && message.senderId.toString() === userId) {
          // Check if message is older than 15 minutes
          const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
          if (message.timestamp < fifteenMinutesAgo) {
            socket.emit('error', { message: 'Message can only be edited within 15 minutes' });
            return;
          }

          message.originalContent = message.content;
          message.content = newContent;
          message.isEdited = true;
          message.editedAt = new Date();
          await message.save();

          // Emit to conversation participants
          emitToConversation(message.conversationId, 'message_edited', {
            messageId,
            newContent,
            editedAt: message.editedAt
          });
        }
      } catch (error) {
        console.error('Error editing message:', error);
      }
    });

    // Handle message deletion
    socket.on('message_deleted', async (data) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId);
        
        if (message && message.senderId.toString() === userId) {
          const conversationId = message.conversationId;
          await Message.findByIdAndDelete(messageId);

          // Emit to conversation participants
          emitToConversation(conversationId, 'message_deleted', {
            messageId,
            conversationId
          });
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    });

    // Handle chat mute toggle
    socket.on('chat_mute_toggled', async (data) => {
      try {
        const { conversationId } = data;
        const chat = await Chat.findById(conversationId);
        
        if (chat && chat.participants.includes(userId)) {
          await chat.toggleMute(userId);
          
          // Emit to conversation participants
          emitToConversation(conversationId, 'chat_mute_toggled', {
            conversationId,
            userId,
            isMuted: chat.isUserMuted(userId)
          });
        }
      } catch (error) {
        console.error('Error toggling chat mute:', error);
      }
    });

    // Handle chat pin toggle
    socket.on('chat_pin_toggled', async (data) => {
      try {
        const { conversationId } = data;
        const chat = await Chat.findById(conversationId);
        
        if (chat && chat.participants.includes(userId)) {
          await chat.togglePin(userId);
          
          // Emit to conversation participants
          emitToConversation(conversationId, 'chat_pin_toggled', {
            conversationId,
            userId,
            isPinned: chat.isPinnedForUser(userId)
          });
        }
      } catch (error) {
        console.error('Error toggling chat pin:', error);
      }
    });

    // Handle voice call requests
    socket.on('voice_call_request', (data) => {
      const { recipientId, conversationId } = data;
      emitToUser(recipientId, 'voice_call_request', {
        callerId: userId,
        conversationId,
        timestamp: new Date()
      });
    });

    // Handle video call requests
    socket.on('video_call_request', (data) => {
      const { recipientId, conversationId } = data;
      emitToUser(recipientId, 'video_call_request', {
        callerId: userId,
        conversationId,
        timestamp: new Date()
      });
    });

    // Handle call responses
    socket.on('call_accepted', (data) => {
      const { callerId, conversationId } = data;
      emitToUser(callerId, 'call_accepted', {
        recipientId: userId,
        conversationId,
        timestamp: new Date()
      });
    });

    socket.on('call_rejected', (data) => {
      const { callerId, conversationId, reason } = data;
      emitToUser(callerId, 'call_rejected', {
        recipientId: userId,
        conversationId,
        reason,
        timestamp: new Date()
      });
    });

    socket.on('call_ended', (data) => {
      const { recipientId, conversationId, duration } = data;
      emitToUser(recipientId, 'call_ended', {
        callerId: userId,
        conversationId,
        duration,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${userId} disconnected`);

      // Remove from active users
      activeUsers.delete(userId);
      userConversations.delete(userId);

      // Update user offline status
      User().findByIdAndUpdate(userId, { 
        $set: { 
          isOnline: false,
          lastSeen: new Date()
        } 
      }).catch(console.error);

      // Emit user offline status to all users
      socket.broadcast.emit('user_status_change', {
        userId,
        isOnline: false,
        lastSeen: new Date()
      });
    });
  });
};

module.exports = {
  setupChatSocket,
  emitToUser,
  emitToConversation,
  emitTypingIndicator,
  emitMessageStatusUpdate,
  emitNewMessage
};
