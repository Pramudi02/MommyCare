const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { emitToUser } = require('../socket/chatSocket');

// Get user conversations
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User().findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const conversations = await Chat.getUserChats(userId);

    // Format conversations for frontend
    const formattedConversations = conversations.map(chat => {
      return {
        id: chat._id,
        type: chat.chatType,
        participants: chat.participants.map(participant => ({
          id: participant._id,
          name: participant.fullName,
          role: participant.role,
          avatar: null
        })),
        lastMessage: chat.lastMessage ? {
          id: null,
          content: chat.lastMessage.content,
          messageType: chat.lastMessage.messageType,
          timestamp: chat.lastMessage.timestamp,
          sender: chat.lastMessage.sender && chat.lastMessage.sender.toString() === userId ? 'user' : 'provider',
          status: chat.lastMessage.status || 'sent'
        } : null,
        unreadCount: chat.unreadCount || 0,
        isMuted: chat.isUserMuted(userId),
        isPinned: chat.isPinnedForUser(userId),
        metadata: chat.metadata || {}
      };
    });

    res.json({
      success: true,
      data: formattedConversations
    });
  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get conversation messages
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    const userId = req.user.id;

    const chat = await Chat.findById(conversationId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // In Message model, messages are stored with sender/recipient and a virtual conversation id.
    // To fetch by our Chat document id, resolve the two participants and then get their conversation.
    const [userA, userB] = chat.participants.map(p => p.toString());
    const messages = await Message.getConversation(userA, userB, parseInt(limit), parseInt(skip));
    
    // Populate replyTo data for messages that have replies
    await Message.populate(messages, {
      path: 'replyTo',
      select: 'content sender',
      populate: {
        path: 'sender',
        select: 'firstName lastName role'
      }
    });
    
    // Format messages for frontend
    const formattedMessages = messages.map(message => ({
      id: message._id,
      content: message.content,
      messageType: message.messageType,
      timestamp: message.createdAt,
      sender: message.sender._id.toString() === userId ? 'user' : 'provider',
      senderId: message.sender._id,
      recipientId: message.recipient._id,
      read: message.read,
      file: message.file || null,
      attachments: message.attachments || [],
      isEdited: message.isEdited || false,
      editedAt: message.editedAt || null,
      reactions: message.reactions || [],
      replyTo: message.replyTo ? {
        sender: message.replyTo.sender._id.toString() === userId ? 'user' : 'provider',
        content: message.replyTo.content
      } : null
    }));

    const total = await Message.countDocuments({
      $or: [
        { sender: userA, recipient: userB },
        { sender: userB, recipient: userA }
      ]
    });

    res.json({
      success: true,
      data: formattedMessages,
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        total
      }
    });
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType = 'text', replyTo, file } = req.body;
    const senderId = req.user.id;

    console.log('Sending message:', { senderId, recipientId, content, messageType });

    if (!recipientId || !content) {
      return res.status(400).json({ success: false, message: 'Recipient ID and content are required' });
    }

    // Validate recipient exists
    const recipient = await User().findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // Find or create chat
    const chat = await Chat.findOrCreateChat(senderId, recipientId);
    console.log('Chat found/created:', chat._id);

    // Create message
    const messageData = {
      sender: senderId,
      recipient: recipientId,
      content,
      messageType,
      replyTo: replyTo || null,
      file: file || null
    };
    
    console.log('Creating message with data:', messageData);
    const message = await Message.create(messageData);

    // Populate sender and recipient details
    await message.populate([
      { path: 'sender', select: 'firstName lastName role' },
      { path: 'recipient', select: 'firstName lastName role' }
    ]);

    console.log('Message created and populated:', message._id);

    // Update chat's last message
    await chat.updateLastMessage(message);

    // Format message for frontend
    const formattedMessage = {
      id: message._id,
      content: message.content,
      messageType: message.messageType,
      timestamp: message.createdAt,
      sender: 'user',
      senderId: message.sender._id,
      recipientId: message.recipient._id,
      read: message.read,
      file: message.file || null,
      attachments: message.attachments || [],
      isEdited: message.isEdited || false,
      editedAt: message.editedAt || null,
      reactions: message.reactions || [],
      replyTo: message.replyTo || null,
      conversationId: chat._id
    };

    console.log('Formatted message:', formattedMessage);

    // Emit to recipient via socket
    try {
      emitToUser(recipientId.toString(), 'new_message', {
        conversationId: chat._id,
        message: formattedMessage
      });
      console.log('Message emitted to recipient:', recipientId);
    } catch (socketError) {
      console.error('Socket emission failed:', socketError);
      // Don't fail the request if socket emission fails
    }

    res.json({
      success: true,
      data: formattedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user is sender or recipient
    if (message.senderId.toString() !== userId && message.recipientId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    message.status = status;
    await message.save();

    res.json({
      success: true,
      data: { id: message._id, status: message.status }
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Mark conversation as read
const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(conversationId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Mark messages as read where current user is recipient and other participant is sender
    const otherId = chat.participants.find(p => p.toString() !== userId.toString());
    await Message.updateMany({ recipient: userId, sender: otherId, read: false }, { $set: { read: true, status: 'read', readAt: new Date() } });

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Search conversations
const searchConversations = async (req, res) => {
  try {
    const { query, role } = req.query;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    let searchCriteria = {
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    };

    if (role) {
      searchCriteria.role = role;
    }

    // Exclude current user
    searchCriteria._id = { $ne: userId };

    const users = await User().find(searchCriteria).select('firstName lastName role');
    
    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.fullName,
      role: user.role,
      avatar: null // No avatar field in original User model
    }));

    res.json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Toggle chat mute
const toggleChatMute = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(conversationId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await chat.toggleMute(userId);
    
    res.json({
      success: true,
      data: { isMuted: chat.isUserMuted(userId) }
    });
  } catch (error) {
    console.error('Error toggling chat mute:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Toggle chat pin
const toggleChatPin = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(conversationId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await chat.togglePin(userId);
    
    res.json({
      success: true,
      data: { isPinned: chat.isPinnedForUser(userId) }
    });
  } catch (error) {
    console.error('Error toggling chat pin:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get chat participants
const getChatParticipants = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(conversationId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const participants = await chat.populate('participants', 'firstName lastName role');
    
    const formattedParticipants = participants.participants.map(participant => ({
      id: participant._id,
      name: participant.fullName,
      role: participant.role,
      avatar: null // No avatar field in original User model
    }));

    res.json({
      success: true,
      data: formattedParticipants
    });
  } catch (error) {
    console.error('Error getting chat participants:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Edit message
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user is sender
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only sender can edit message' });
    }

    // Check if message is older than 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (message.timestamp < fifteenMinutesAgo) {
      return res.status(400).json({ success: false, message: 'Message can only be edited within 15 minutes' });
    }

    message.originalContent = message.content;
    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.json({
      success: true,
      data: {
        id: message._id,
        content: message.content,
        isEdited: message.isEdited,
        editedAt: message.editedAt
      }
    });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add message reaction
const addMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    if (!emoji) {
      return res.status(400).json({ success: false, message: 'Emoji is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
    
    // Add new reaction
    message.reactions.push({ userId, emoji });
    await message.save();

    res.json({
      success: true,
      data: { reactions: message.reactions }
    });
  } catch (error) {
    console.error('Error adding message reaction:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Remove message reaction
const removeMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Remove reaction from this user
    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
    await message.save();

    res.json({
      success: true,
      data: { reactions: message.reactions }
    });
  } catch (error) {
    console.error('Error removing message reaction:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all healthcare providers (doctors and midwives)
const getAllHealthcareProviders = async (req, res) => {
  try {
    const { role } = req.query;
    const userId = req.user.id;

    let searchCriteria = {
      role: { $in: ['doctor', 'midwife'] }
    };

    // If specific role is requested, filter by that role
    if (role && (role === 'doctor' || role === 'midwife')) {
      searchCriteria.role = role;
    }

    // Exclude current user
    searchCriteria._id = { $ne: userId };

    // Get all healthcare providers
    const providers = await User().find(searchCriteria)
      .select('firstName lastName role email isActive')
      .sort({ firstName: 1, lastName: 1 });
    
    console.log('Found providers:', providers.length);
    console.log('Sample provider:', providers[0]);
    
    // Format providers for frontend
    const formattedProviders = providers.map(provider => ({
      id: provider._id,
      name: `${provider.firstName} ${provider.lastName}`,
      role: provider.role,
      email: provider.email,
      isActive: provider.isActive,
      avatar: `https://ui-avatars.com/api/?name=${provider.firstName}&background=${provider.role === 'doctor' ? '667eea' : 'ff6b6b'}&color=fff`,
      specialty: provider.role === 'doctor' ? 'General Medicine' : 'Midwifery',
      status: 'online', // Default status
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0,
      rating: 4.8, // Default rating
      experience: '5+ years', // Default experience
      location: 'Medical Center', // Default location
      isTyping: false,
      availability: 'Available now',
      nextAppointment: 'TBD'
    }));

    res.json({
      success: true,
      data: formattedProviders,
      total: formattedProviders.length
    });
  } catch (error) {
    console.error('Error getting healthcare providers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete message permanently
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Check if user is authorized to delete this message (only sender can delete)
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'You can only delete your own messages' });
    }

    // Delete the message permanently
    await Message.findByIdAndDelete(messageId);

    // Emit socket event to notify other participants
    const recipientId = message.recipient.toString();
    emitToUser(recipientId, 'message_deleted', {
      messageId: messageId,
      conversationId: message.conversationId
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  updateMessageStatus,
  markConversationAsRead,
  searchConversations,
  toggleChatMute,
  toggleChatPin,
  getChatParticipants,
  editMessage,
  addMessageReaction,
  removeMessageReaction,
  getAllHealthcareProviders,
  deleteMessage
};
