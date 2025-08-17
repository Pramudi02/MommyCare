const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  conversationId: {
    type: String,
    unique: true,
    index: true
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image', 'audio', 'video'],
      default: 'text'
    },
    status: {
      type: String,
      enum: ['sending', 'sent', 'delivered', 'read'],
      default: 'sent'
    }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  // Additional fields for enhanced functionality
  chatType: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  // For group chats
  groupName: String,
  groupAvatar: String,
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Chat settings
  isMuted: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  isPinned: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  // For appointment-related chats
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  // Chat metadata
  metadata: {
    specialty: String,
    location: String,
    rating: Number,
    experience: String,
    availability: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ChatSchema.index({ participants: 1 });
ChatSchema.index({ conversationId: 1 });
ChatSchema.index({ lastActivity: -1 });
ChatSchema.index({ 'lastMessage.timestamp': -1 });
ChatSchema.index({ chatType: 1 });

// Pre-save middleware to set conversation ID
ChatSchema.pre('save', function(next) {
  if (!this.conversationId && this.participants.length === 2) {
    const sortedIds = this.participants.map(p => p.toString()).sort();
    this.conversationId = `${sortedIds[0]}_${sortedIds[1]}`;
  }
  next();
});

// Method to update last message
ChatSchema.methods.updateLastMessage = function(message) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    timestamp: message.createdAt || new Date(),
    messageType: message.messageType || 'text',
    status: message.status || 'sent'
  };
  this.lastActivity = new Date();
  return this.save();
};

// Method to increment unread count for a participant
ChatSchema.methods.incrementUnreadCount = function(participantId) {
  const currentCount = this.unreadCount.get(participantId.toString()) || 0;
  this.unreadCount.set(participantId.toString(), currentCount + 1);
  return this.save();
};

// Method to reset unread count for a participant
ChatSchema.methods.resetUnreadCount = function(participantId) {
  this.unreadCount.set(participantId.toString(), 0);
  return this.save();
};

// Method to toggle mute status for a participant
ChatSchema.methods.toggleMute = function(participantId) {
  const currentMuteStatus = this.isMuted.get(participantId.toString()) || false;
  this.isMuted.set(participantId.toString(), !currentMuteStatus);
  return this.save();
};

// Method to toggle pin status for a participant
ChatSchema.methods.togglePin = function(participantId) {
  const currentPinStatus = this.isPinned.get(participantId.toString()) || false;
  this.isPinned.set(participantId.toString(), !currentPinStatus);
  return this.save();
};

// Method to get other participant in direct chat
ChatSchema.methods.getOtherParticipant = function(userId) {
  if (this.chatType === 'direct' && this.participants.length === 2) {
    return this.participants.find(p => p.toString() !== userId.toString());
  }
  return null;
};

// Method to check if user is muted
ChatSchema.methods.isUserMuted = function(userId) {
  return this.isMuted.get(userId.toString()) || false;
};

// Method to check if chat is pinned for user
ChatSchema.methods.isPinnedForUser = function(userId) {
  return this.isPinned.get(userId.toString()) || false;
};

// Static method to find or create chat between two users
ChatSchema.statics.findOrCreateChat = async function(user1Id, user2Id) {
  let chat = await this.findOne({
    participants: { $all: [user1Id, user2Id] },
    chatType: 'direct'
  });

  if (!chat) {
    chat = new this({
      participants: [user1Id, user2Id],
      chatType: 'direct'
    });
    await chat.save();
  }

  return chat;
};

// Ensure a chats document exists when a new message is sent
ChatSchema.statics.ensureChatExists = async function(user1Id, user2Id) {
  return this.findOrCreateChat(user1Id, user2Id);
};

// Static method to get user's active chats
ChatSchema.statics.getUserChats = function(userId, options = {}) {
  const query = {
    participants: userId,
    isActive: true
  };

  if (options.chatType) {
    query.chatType = options.chatType;
  }

  return this.find(query)
    .populate('participants', 'firstName lastName email role avatar specialty')
    .populate('lastMessage.sender', 'firstName lastName avatar')
    .sort({ lastActivity: -1 });
};

module.exports = mongoose.model('Chat', ChatSchema);
