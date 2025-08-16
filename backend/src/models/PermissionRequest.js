const mongoose = require('mongoose');

const permissionRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    lowercase: true
  },
  userRole: {
    type: String,
    enum: ['doctor', 'midwife', 'service_provider'],
    required: [true, 'User role is required']
  },
  requestType: {
    type: String,
    enum: ['permission_request', 'verification_request', 'access_request'],
    default: 'permission_request'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requestDetails: {
    specialization: String, // for doctors
    licenseNumber: String, // for doctors
    hospital: String, // for doctors
    experience: Number, // for doctors and midwives
    education: [String], // for doctors
    certifications: [String], // for doctors and midwives
    
    // Midwife specific
    certificationNumber: String, // for midwives
    clinic: String, // for midwives
    services: [String], // for midwives
    
    // Service provider specific
    businessName: String, // for service providers
    businessType: String, // for service providers
    registrationNumber: String, // for service providers
    businessServices: [String], // for service providers
    
    // General
    additionalInfo: String,
    reason: String
  },
  adminNotes: [{
    adminId: String,
    adminUsername: String,
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  reviewedBy: {
    adminId: String,
    adminUsername: String,
    reviewedAt: Date
  },
  reviewDate: Date,
  rejectionReason: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
permissionRequestSchema.index({ userId: 1 });
permissionRequestSchema.index({ userRole: 1 });
permissionRequestSchema.index({ status: 1 });
permissionRequestSchema.index({ createdAt: -1 });
permissionRequestSchema.index({ priority: 1 });

// Virtual for request age
permissionRequestSchema.virtual('requestAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Pre-save middleware to update review date when status changes
permissionRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.reviewDate = new Date();
  }
  next();
});

// Static method to get requests by status
permissionRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get requests by role
permissionRequestSchema.statics.getByRole = function(role) {
  return this.find({ userRole: role }).sort({ createdAt: -1 });
};

// Static method to get urgent requests
permissionRequestSchema.statics.getUrgentRequests = function() {
  return this.find({ 
    $or: [{ priority: 'urgent' }, { isUrgent: true }] 
  }).sort({ createdAt: -1 });
};

// Function to get the PermissionRequest model with the correct database connection
let PermissionRequest = null;

const getPermissionRequestModel = () => {
  if (!PermissionRequest) {
    const { getAdminConnection } = require('../config/database');
    const adminConnection = getAdminConnection();
    
    if (!adminConnection) {
      throw new Error('Admin database connection not available');
    }
    
    PermissionRequest = adminConnection.model('PermissionRequest', permissionRequestSchema);
  }
  return PermissionRequest;
};

module.exports = getPermissionRequestModel;
