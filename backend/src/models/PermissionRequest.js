const mongoose = require('mongoose');

const permissionRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userRole: {
    type: String,
    enum: ['doctor', 'midwife', 'service_provider'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String
  },
  
  // Doctor specific fields
  hospitalName: String,
  hospitalAddress: String,
  hospitalPhone: String,
  hospitalEmail: String,
  doctorSpecialization: String,
  registrationNumber: String,
  licenseNumber: String,
  yearsOfExperience: String,
  
  // Midwife specific fields
  midwifeLicenseNumber: String,
  midwifeExperience: String,
  phmArea: String,
  mohArea: String,
  midwifeCertifications: String,
  midwifePhone: String,
  midwifeAddress: String,
  
  // Service Provider specific fields
  businessName: String,
  businessType: String,
  businessAddress: String,
  businessPhone: String,
  businessEmail: String,
  businessLicense: String,
  serviceCategories: [String],
  
  // Common location fields
  location: {
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Document references (file paths)
  documents: {
    license: String,
    certificate: String,
    idProof: String,
    businessLicense: String,
    additionalDocuments: [String]
  }
}, {
  timestamps: true
});

// Index for efficient queries
permissionRequestSchema.index({ user: 1, status: 1 });
permissionRequestSchema.index({ userRole: 1, status: 1 });
permissionRequestSchema.index({ submittedAt: -1 });

// Virtual for checking if request is pending
permissionRequestSchema.virtual('isPending').get(function() {
  return this.status === 'pending';
});

// Virtual for checking if request is approved
permissionRequestSchema.virtual('isApproved').get(function() {
  return this.status === 'approved';
});

// Virtual for checking if request is rejected
permissionRequestSchema.virtual('isRejected').get(function() {
  return this.status === 'rejected';
});

// Method to approve request
permissionRequestSchema.methods.approve = function(adminId, notes = '') {
  this.status = 'approved';
  this.reviewedAt = new Date();
  this.reviewedBy = adminId;
  this.adminNotes = notes;
  return this.save();
};

// Method to reject request
permissionRequestSchema.methods.reject = function(adminId, notes = '') {
  this.status = 'rejected';
  this.reviewedAt = new Date();
  this.reviewedBy = adminId;
  this.adminNotes = notes;
  return this.save();
};

// Static method to get pending requests
permissionRequestSchema.statics.getPendingRequests = function() {
  return this.find({ status: 'pending' })
    .populate('user', 'firstName lastName email role')
    .sort({ submittedAt: -1 });
};

// Static method to get requests by role
permissionRequestSchema.statics.getRequestsByRole = function(role) {
  return this.find({ userRole: role })
    .populate('user', 'firstName lastName email role')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ submittedAt: -1 });
};

// Static method to get requests by user
permissionRequestSchema.statics.getRequestsByUser = function(userId) {
  return this.find({ user: userId })
    .populate('user', 'firstName lastName email role')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ submittedAt: -1 });
};

// Static method to get request by user and role
permissionRequestSchema.statics.getRequestByUserAndRole = function(userId, role) {
  return this.findOne({ user: userId, userRole: role })
    .populate('user', 'firstName lastName email role')
    .populate('reviewedBy', 'firstName lastName');
};

// Function to get the PermissionRequest model with the correct database connection
let PermissionRequest = null;

const getPermissionRequestModel = () => {
  if (!PermissionRequest) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    
    if (!authConnection) {
      throw new Error('Auth database connection not available');
    }
    
    PermissionRequest = authConnection.model('PermissionRequest', permissionRequestSchema);
  }
  return PermissionRequest;
};

module.exports = getPermissionRequestModel;
