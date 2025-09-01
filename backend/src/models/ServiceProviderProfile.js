const mongoose = require('mongoose');

const serviceProviderProfileSchema = new mongoose.Schema({
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
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
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['Online Store', 'Physical Store', 'Both', 'Manufacturer', 'Distributor'],
    default: 'Online Store'
  },
  established: {
    type: String,
    trim: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  certifications: [{
    type: String,
    trim: true
  }],
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  },
  profileImage: {
    type: String,
    trim: true
  },
  businessStats: {
    productsListed: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    externalClicks: {
      type: Number,
      default: 0
    },
    activeProducts: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
serviceProviderProfileSchema.index({ serviceProvider: 1 });
serviceProviderProfileSchema.index({ businessName: 1 });
serviceProviderProfileSchema.index({ status: 1 });

module.exports = mongoose.model('ServiceProviderProfile', serviceProviderProfileSchema);
