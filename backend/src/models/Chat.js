const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  conversationId: {
    type: String,
    required: true,
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
      enum: ['text', 'file', 'image'],
      default: 'text'
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
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ChatSchema.index({ participants: 1 });
ChatSchema.index({ conversationId: 1 });
ChatSchema.index({ lastActivity: -1 });

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
    messageType: message.messageType || 'text'
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

module.exports = mongoose.model('Chat', ChatSchema);
