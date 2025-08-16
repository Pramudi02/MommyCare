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
  
  // Message type
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video', 'location'],
    default: 'text'
  },
  
  // Media attachments
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'audio', 'video']
    },
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Read status
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
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: 1 });

// Virtual for conversation ID (unique identifier for a conversation between two users)
messageSchema.virtual('conversationId').get(function() {
  const users = [this.sender.toString(), this.recipient.toString()].sort();
  return `${users[0]}-${users[1]}`;
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
  this.readAt = new Date();
  return this.save();
};

// Instance method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
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
  .populate('sender', 'firstName lastName profilePicture')
  .populate('recipient', 'firstName lastName profilePicture')
  .populate('replyTo', 'content');
};

// Static method to get unread messages count
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    status: { $in: ['sent', 'delivered'] }
  });
};

// Static method to mark all messages as read
messageSchema.statics.markAllAsRead = function(userId, senderId) {
  return this.updateMany(
    {
      recipient: userId,
      sender: senderId,
      status: { $in: ['sent', 'delivered'] }
    },
    {
      status: 'read',
      readAt: new Date()
    }
  );
};

// Function to get the Message model with the correct database connection
let Message = null;

const getMessageModel = () => {
  if (!Message) {
    const { getMommyCareDataConnection } = require('../config/database');
    const mommyCareDataConnection = getMommyCareDataConnection();
    
    if (!mommyCareDataConnection) {
      throw new Error('MommyCareData database connection not available');
    }
    
    Message = mommyCareDataConnection.model('Message', messageSchema);
  }
  return Message;
};

module.exports = getMessageModel;
