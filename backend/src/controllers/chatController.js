const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

// Get all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all chats where user is a participant
    const chats = await Chat.find({ 
      participants: userId,
      isActive: true 
    })
    .populate('participants', 'name email role avatar specialty')
    .populate('lastMessage.sender', 'name avatar')
    .sort({ lastActivity: -1 });

    // Format conversations for frontend
    const conversations = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString());
      const unreadCount = chat.unreadCount.get(userId.toString()) || 0;
      
      return {
        id: chat._id,
        conversationId: chat.conversationId,
        participant: otherParticipant,
        lastMessage: chat.lastMessage,
        unreadCount,
        lastActivity: chat.lastActivity,
        startedAt: chat.startedAt
      };
    });

    res.json({
      status: 'success',
      data: conversations
    });
  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch conversations'
    });
  }
};

// Get conversation messages
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of this conversation
    const chat = await Chat.findOne({ 
      conversationId,
      participants: userId 
    });

    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }

    // Get messages for this conversation by finding messages between participants
    const messages = await Message.find({
      $or: [
        { sender: { $in: chat.participants }, recipient: { $in: chat.participants } }
      ]
    })
      .populate('sender', 'name avatar role specialty')
      .populate('recipient', 'name avatar role specialty')
      .sort({ createdAt: 1 });

    // Filter messages to only include those in this conversation
    const conversationMessages = messages.filter(message => {
      const messageConversationId = message.conversationId;
      return messageConversationId === conversationId;
    });

    // Mark messages as read
    await Message.updateMany(
      { 
        _id: { $in: conversationMessages.map(m => m._id) },
        recipient: userId,
        read: false 
      },
      { 
        $set: { 
          read: true,
          readAt: new Date()
        } 
      }
    );

    // Reset unread count for this user
    await chat.resetUnreadCount(userId);

    res.json({
      status: 'success',
      data: conversationMessages
    });
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages'
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType = 'text', file } = req.body;
    const senderId = req.user._id;

    // Validate recipient
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipient not found'
      });
    }

    // Create or find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, recipientId]
      });
      await chat.save();
    }

    // Create message
    const messageData = {
      sender: senderId,
      recipient: recipientId,
      content,
      messageType,
      status: 'sent'
    };

    if (file) {
      messageData.file = file;
    }

    const message = await Message.create(messageData);

    // Populate sender info
    await message.populate('sender', 'name avatar role specialty');
    await message.populate('recipient', 'name avatar role specialty');

    // Update chat with last message
    await chat.updateLastMessage(message);

    // Increment unread count for recipient
    await chat.incrementUnreadCount(recipientId);

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${recipientId}`).emit('new_message', {
      message,
      conversationId: chat.conversationId,
      unreadCount: chat.unreadCount.get(recipientId.toString()) || 0
    });

    res.status(201).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message'
    });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  try {
    const { messageId, status } = req.body;
    const userId = req.user._id;

    const message = await Message.findOneAndUpdate(
      { 
        _id: messageId,
        recipient: userId 
      },
      { 
        $set: { 
          status,
          readAt: status === 'read' ? new Date() : null
        } 
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    res.json({
      status: 'success',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update message status'
    });
  }
};

// Mark conversation as read
const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of this conversation
    const chat = await Chat.findOne({ 
      conversationId,
      participants: userId 
    });

    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }

    // Mark all unread messages as read for this user in this conversation
    const messages = await Message.find({
      $or: [
        { sender: { $in: chat.participants }, recipient: { $in: chat.participants } }
      ]
    });

    const conversationMessages = messages.filter(message => {
      const messageConversationId = message.conversationId;
      return messageConversationId === conversationId;
    });

    await Message.updateMany(
      { 
        _id: { $in: conversationMessages.map(m => m._id) },
        recipient: userId,
        read: false 
      },
      { 
        $set: { 
          read: true,
          readAt: new Date(),
          status: 'read'
        } 
      }
    );

    // Reset unread count for this user
    await chat.resetUnreadCount(userId);

    res.json({
      status: 'success',
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark conversation as read'
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOneAndDelete({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found or unauthorized'
      });
    }

    res.json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message'
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ 
      participants: userId,
      isActive: true 
    });

    let totalUnread = 0;
    const unreadByConversation = {};

    chats.forEach(chat => {
      const unreadCount = chat.unreadCount.get(userId.toString()) || 0;
      totalUnread += unreadCount;
      unreadByConversation[chat.conversationId] = unreadCount;
    });

    res.json({
      status: 'success',
      data: {
        totalUnread,
        unreadByConversation
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get unread count'
    });
  }
};

// Search conversations
const searchConversations = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.json({
        status: 'success',
        data: []
      });
    }

    // Find users matching the search query
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { specialty: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: userId }
    }).select('name email role avatar specialty');

    // Find existing conversations with these users
    const existingChats = await Chat.find({
      participants: { $in: users.map(u => u._id) },
      participants: userId
    });

    const searchResults = users.map(user => {
      const existingChat = existingChats.find(chat => 
        chat.participants.includes(user._id)
      );

      return {
        user,
        hasExistingChat: !!existingChat,
        conversationId: existingChat?.conversationId || null
      };
    });

    res.json({
      status: 'success',
      data: searchResults
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search conversations'
    });
  }
};

module.exports = {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  updateMessageStatus,
  markConversationAsRead,
  deleteMessage,
  getUnreadCount,
  searchConversations
};
