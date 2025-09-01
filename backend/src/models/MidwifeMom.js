const mongoose = require('mongoose');

const midwifeMomSchema = new mongoose.Schema({
  midwife: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'completed'],
    default: 'active'
  },
  notes: {
    type: String,
    default: ''
  },
  assignedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
midwifeMomSchema.index({ midwife: 1, mom: 1 });
midwifeMomSchema.index({ mom: 1, status: 1 });
midwifeMomSchema.index({ status: 1 });

// Virtual for full name
midwifeMomSchema.virtual('midwifeName').get(function() {
  return this.midwife ? `${this.midwife.firstName} ${this.midwife.lastName}` : '';
});

midwifeMomSchema.virtual('momName').get(function() {
  return this.mom ? `${this.mom.firstName} ${this.mom.lastName}` : '';
});

// Ensure virtual fields are serialized
midwifeMomSchema.set('toJSON', { virtuals: true });
midwifeMomSchema.set('toObject', { virtuals: true });

// Static method to find active assignment for a mom
midwifeMomSchema.statics.findActiveByMom = function(momId) {
  return this.findOne({ mom: momId, status: 'active' }).populate('midwife');
};

// Static method to find active assignments for a midwife
midwifeMomSchema.statics.findActiveByMidwife = function(midwifeId) {
  return this.find({ midwife: midwifeId, status: 'active' }).populate('mom');
};

// Static method to check if assignment exists
midwifeMomSchema.statics.checkAssignment = function(midwifeId, momId) {
  return this.findOne({ midwife: midwifeId, mom: momId, status: 'active' });
};

module.exports = mongoose.model('MidwifeMom', midwifeMomSchema);
