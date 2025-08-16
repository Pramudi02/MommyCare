const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text'
  },
  file: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read'],
    default: 'sent'
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
MessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

// Virtual for conversation ID generation
MessageSchema.virtual('conversationId').get(function() {
  const sortedIds = [this.sender.toString(), this.recipient.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
});

// Pre-save middleware to set conversation ID (if needed for queries)
MessageSchema.pre('save', function(next) {
  // The conversationId is virtual, so we don't need to set it here
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
