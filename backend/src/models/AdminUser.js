const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: [{
    type: String,
    enum: ['user_management', 'system_config', 'audit_logs', 'database_admin']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
adminUserSchema.index({ email: 1 }, { unique: true });
adminUserSchema.index({ username: 1 }, { unique: true });
adminUserSchema.index({ role: 1 });

// Pre-save middleware to hash password
adminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to generate JWT token
adminUserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      role: this.role,
      email: this.email,
      username: this.username,
      isAdmin: true
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Instance method to check password
adminUserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Function to get the AdminUser model with the correct database connection
let AdminUser = null;

const getAdminUserModel = () => {
  if (!AdminUser) {
    const { getAdminConnection } = require('../config/database');
    const adminConnection = getAdminConnection();
    
    if (!adminConnection) {
      throw new Error('Admin database connection not available');
    }
    
    AdminUser = adminConnection.model('AdminUser', adminUserSchema);
  }
  return AdminUser;
};

module.exports = getAdminUserModel;
