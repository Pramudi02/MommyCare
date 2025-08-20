const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Participants
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  
  // Message content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  
  // Message type - updated to match frontend
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video', 'location'],
    default: 'text'
  },
  
  // Message status - updated to match frontend
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Media attachments
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'audio', 'video']
    },
    url: String,
    filename: String,
    originalName: String,
    size: Number,
    mimeType: String,
    path: String
  }],
  
  // Read status
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  deliveredAt: Date,
  
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Related appointment (if message is about an appointment)
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  // Message priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Encryption (for sensitive medical information)
  isEncrypted: {
    type: Boolean,
    default: false
  },
  
  // Message tags
  tags: [String],
  
  // System messages
  isSystemMessage: {
    type: Boolean,
    default: false
  },
  systemType: {
    type: String,
    enum: ['appointment_reminder', 'appointment_confirmation', 'appointment_cancellation', 'welcome', 'other']
  },
  
  // For file/image messages
  file: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  
  // Message reactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Message editing
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  originalContent: String,
  
  // Message forwarding
  isForwarded: {
    type: Boolean,
    default: false
  },
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Message scheduling
  scheduledFor: Date,
  isScheduled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: 1 });
messageSchema.index({ conversationId: 1 });
messageSchema.index({ read: 1 });

// Virtual for conversation ID (unique identifier for a conversation between two users)
messageSchema.virtual('conversationId').get(function() {
  const users = [this.sender.toString(), this.recipient.toString()].sort();
  return `${users[0]}_${users[1]}`;
});

// Virtual for sender name
messageSchema.virtual('senderName').get(function() {
  if (this.sender && this.sender.firstName && this.sender.lastName) {
    return `${this.sender.firstName} ${this.sender.lastName}`;
  }
  return this.sender?.email || 'Unknown User';
});

// Virtual for recipient name
messageSchema.virtual('recipientName').get(function() {
  if (this.recipient && this.recipient.firstName && this.recipient.lastName) {
    return `${this.recipient.firstName} ${this.recipient.lastName}`;
  }
  return this.recipient?.email || 'Unknown User';
});

// Pre-save middleware to set delivered timestamp
messageSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'sent') {
    this.deliveredAt = new Date();
  }
  next();
});

// Instance method to mark as read
messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Instance method to edit message
messageSchema.methods.editMessage = function(newContent) {
  if (!this.originalContent) {
    this.originalContent = this.content;
  }
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Instance method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  
  // Add new reaction
  this.reactions.push({
    user: userId,
    emoji,
    createdAt: new Date()
  });
  
  return this.save();
};

// Instance method to remove reaction
messageSchema.methods.removeReaction = function(userId, emoji) {
  this.reactions = this.reactions.filter(r => 
    !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  return this.save();
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = function(user1Id, user2Id, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { sender: user1Id, recipient: user2Id },
      { sender: user2Id, recipient: user1Id }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'firstName lastName profilePicture avatar role specialty')
  .populate('recipient', 'firstName lastName profilePicture avatar role specialty')
  .populate('replyTo', 'content')
  .populate('reactions.user', 'firstName lastName avatar');
};

// Static method to get unread messages count
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    read: false
  });
};

// Static method to mark all messages as read
messageSchema.statics.markAllAsRead = function(userId, senderId) {
  return this.updateMany(
    {
      recipient: userId,
      sender: senderId,
      read: false
    },
    {
      read: true,
      status: 'read',
      readAt: new Date()
    }
  );
};

// Static method to get messages by conversation ID
messageSchema.statics.getMessagesByConversation = function(conversationId, limit = 50, skip = 0) {
  return this.find({
    conversationId: conversationId
  })
  .sort({ createdAt: 1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'firstName lastName profilePicture avatar role specialty')
  .populate('recipient', 'firstName lastName profilePicture avatar role specialty')
  .populate('replyTo', 'content')
  .populate('reactions.user', 'firstName lastName avatar');
};

// Static method to search messages
messageSchema.statics.searchMessages = function(userId, query, limit = 20) {
  return this.find({
    $or: [
      { sender: userId },
      { recipient: userId }
    ],
    content: { $regex: query, $options: 'i' }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'firstName lastName avatar')
  .populate('recipient', 'firstName lastName avatar');
};

module.exports = mongoose.model('Message', messageSchema);
