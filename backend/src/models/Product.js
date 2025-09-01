const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Service Provider Information
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Basic Product Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },

  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Feeding',
      'Comfort', 
      'Travel', 
      'Clothing', 
      'Safety', 
      'Toys', 
      'Health',
      'Bath & Care',
      'Sleep',
      'Development'
    ]
  },

  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },

  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },

  // External Link
  externalLink: {
    type: String,
    required: [true, 'External link is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL starting with http:// or https://'
    }
  },

  // Product Image
  image: {
    type: String, // This will store the file path or URL
    required: [true, 'Product image is required']
  },

  // Tags
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  // Status
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive', 'rejected'],
    default: 'pending'
  },

  // Review Information
  review: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    reviewedAt: {
      type: Date
    },
    reviewNotes: {
      type: String,
      maxlength: [500, 'Review notes cannot exceed 500 characters']
    }
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },

  clicks: {
    type: Number,
    default: 0
  },

  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ serviceProvider: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for image URL
productSchema.virtual('imageUrl').get(function() {
  if (this.image) {
    // If it's already a full URL, return as is
    if (this.image.startsWith('http')) {
      return this.image;
    }
    // Otherwise, construct the full URL
    return `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/products/${this.image}`;
  }
  return null;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
  }
  next();
});

// Pre-save middleware to update updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get products by service provider
productSchema.statics.getByServiceProvider = function(serviceProviderId, status = null) {
  const query = { serviceProvider: serviceProviderId };
  if (status) {
    query.status = status;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get active products
productSchema.statics.getActiveProducts = function(category = null) {
  const query = { status: 'active' };
  if (category) {
    query.category = category;
  }
  return this.find(query).populate('serviceProvider', 'name email').sort({ createdAt: -1 });
};

// Instance method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment clicks
productSchema.methods.incrementClicks = function() {
  this.clicks += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
