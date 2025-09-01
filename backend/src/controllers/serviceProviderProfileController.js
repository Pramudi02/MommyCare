const asyncHandler = require('express-async-handler');
const ServiceProviderProfile = require('../models/ServiceProviderProfile');

// @desc    Get service provider profile
// @route   GET /api/service-provider/profile
// @access  Private (Service Provider)
const getServiceProviderProfile = asyncHandler(async (req, res) => {
  try {
    const profile = await ServiceProviderProfile.findOne({ 
      serviceProvider: req.user._id 
    }).populate('serviceProvider', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile first.'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// @desc    Create service provider profile
// @route   POST /api/service-provider/profile
// @access  Private (Service Provider)
const createServiceProviderProfile = asyncHandler(async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await ServiceProviderProfile.findOne({ 
      serviceProvider: req.user._id 
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists. Use update endpoint instead.'
      });
    }

    const profileData = {
      ...req.body,
      serviceProvider: req.user._id
    };

    const profile = await ServiceProviderProfile.create(profileData);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create profile'
    });
  }
});

// @desc    Update service provider profile
// @route   PUT /api/service-provider/profile
// @access  Private (Service Provider)
const updateServiceProviderProfile = asyncHandler(async (req, res) => {
  try {
    const profile = await ServiceProviderProfile.findOne({ 
      serviceProvider: req.user._id 
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update profile fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        profile[key] = req.body[key];
      }
    });

    const updatedProfile = await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @desc    Upload profile image
// @route   POST /api/service-provider/profile/image
// @access  Private (Service Provider)
const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const profile = await ServiceProviderProfile.findOne({ 
      serviceProvider: req.user._id 
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update profile image
    profile.profileImage = req.file.filename;
    await profile.save();

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: req.file.filename,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image'
    });
  }
});

// @desc    Get profile statistics
// @route   GET /api/service-provider/profile/stats
// @access  Private (Service Provider)
const getProfileStats = asyncHandler(async (req, res) => {
  try {
    const profile = await ServiceProviderProfile.findOne({ 
      serviceProvider: req.user._id 
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile.businessStats
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile statistics'
    });
  }
});

// @desc    Update profile statistics
// @route   PUT /api/service-provider/profile/stats
// @access  Private (Service Provider)
const updateProfileStats = asyncHandler(async (req, res) => {
  try {
    const profile = await ServiceProviderProfile.findOne({ 
      serviceProvider: req.user._id 
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update business stats
    if (req.body.businessStats) {
      Object.keys(req.body.businessStats).forEach(key => {
        if (req.body.businessStats[key] !== undefined) {
          profile.businessStats[key] = req.body.businessStats[key];
        }
      });
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile statistics updated successfully',
      data: profile.businessStats
    });
  } catch (error) {
    console.error('Error updating profile stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile statistics'
    });
  }
});

// @desc    Get all service provider profiles (Admin)
// @route   GET /api/admin/service-provider-profiles
// @access  Private (Admin)
const getAllServiceProviderProfiles = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const profiles = await ServiceProviderProfile.find(query)
      .populate('serviceProvider', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ServiceProviderProfile.countDocuments(query);

    res.json({
      success: true,
      data: {
        profiles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalProfiles: count,
          hasNextPage: page * limit < count,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles'
    });
  }
});

// @desc    Update profile status (Admin)
// @route   PUT /api/admin/service-provider-profiles/:id/status
// @access  Private (Admin)
const updateProfileStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['active', 'pending', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const profile = await ServiceProviderProfile.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('serviceProvider', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile status updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error updating profile status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile status'
    });
  }
});

module.exports = {
  getServiceProviderProfile,
  createServiceProviderProfile,
  updateServiceProviderProfile,
  uploadProfileImage,
  getProfileStats,
  updateProfileStats,
  getAllServiceProviderProfiles,
  updateProfileStatus
};
