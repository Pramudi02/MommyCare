const mongoose = require('mongoose');

const midwifeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: false,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  phmArea: {
    type: String,
    trim: true
  },
  mohArea: {
    type: String,
    trim: true
  },
  certifications: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique user profile
midwifeProfileSchema.index({ user: 1 }, { unique: true });

let MidwifeProfile = null;
const getMidwifeProfileModel = () => {
  if (!MidwifeProfile) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    MidwifeProfile = authConnection.model('MidwifeProfile', midwifeProfileSchema);
  }
  return MidwifeProfile;
};

module.exports = { getMidwifeProfileModel };
