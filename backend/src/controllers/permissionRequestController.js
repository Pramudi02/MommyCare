const getPermissionRequestModel = require('../models/PermissionRequest');
const getUserModel = require('../models/User');

// @desc    Submit permission request
// @route   POST /api/:role/permission-request
// @access  Private
const submitPermissionRequest = async (req, res) => {
  try {
    const { role } = req.params;
    const userId = req.user.id;
    
    // Validate role
    if (!['doctor', 'midwife', 'service_provider'].includes(role)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid role. Must be doctor, midwife, or service_provider' 
      });
    }
    
    // Check if user already has a pending request
    const PermissionRequest = getPermissionRequestModel();
    const existingRequest = await PermissionRequest.findOne({
      userId,
      userRole: role,
      status: { $in: ['pending', 'under_review'] }
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'You already have a pending permission request for this role' 
      });
    }
    
    // Extract request details based on role
    const requestDetails = {};
    
    if (role === 'doctor') {
      requestDetails.specialization = req.body.specialization;
      requestDetails.licenseNumber = req.body.licenseNumber;
      requestDetails.hospital = req.body.hospital;
      requestDetails.experience = req.body.experience;
      requestDetails.education = req.body.education || [];
      requestDetails.certifications = req.body.certifications || [];
    } else if (role === 'midwife') {
      requestDetails.certificationNumber = req.body.certificationNumber;
      requestDetails.clinic = req.body.clinic;
      requestDetails.experience = req.body.experience;
      requestDetails.services = req.body.services || [];
    } else if (role === 'service_provider') {
      requestDetails.businessName = req.body.businessName;
      requestDetails.businessType = req.body.businessType;
      requestDetails.registrationNumber = req.body.registrationNumber;
      requestDetails.businessServices = req.body.businessServices || [];
    }
    
    // Common fields
    requestDetails.additionalInfo = req.body.additionalInfo;
    requestDetails.reason = req.body.reason;
    
    // Create permission request
    const permissionRequest = await PermissionRequest.create({
      userId,
      userEmail: req.user.email,
      userRole: role,
      requestType: 'permission_request',
      status: 'pending',
      documents: req.body.documents || [],
      requestDetails,
      priority: req.body.priority || 'medium',
      isUrgent: req.body.isUrgent || false
    });
    
    console.log(`Permission request created for ${role}:`, permissionRequest._id);
    
    res.status(201).json({
      status: 'success',
      message: 'Permission request submitted successfully',
      data: {
        requestId: permissionRequest._id,
        status: permissionRequest.status,
        submittedAt: permissionRequest.createdAt
      }
    });
    
  } catch (error) {
    console.error('Submit permission request error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while submitting permission request' 
    });
  }
};

// @desc    Get user's permission requests
// @route   GET /api/:role/permission-requests
// @access  Private
const getUserPermissionRequests = async (req, res) => {
  try {
    const { role } = req.params;
    const userId = req.user.id;
    
    // Validate role
    if (!['doctor', 'midwife', 'service_provider'].includes(role)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid role' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    const requests = await PermissionRequest.find({
      userId,
      userRole: role
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: requests
    });
    
  } catch (error) {
    console.error('Get user permission requests error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching permission requests' 
    });
  }
};

// @desc    Get permission request by ID
// @route   GET /api/:role/permission-request/:requestId
// @access  Private
const getPermissionRequestById = async (req, res) => {
  try {
    const { role, requestId } = req.params;
    const userId = req.user.id;
    
    // Validate role
    if (!['doctor', 'midwife', 'service_provider'].includes(role)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid role' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    const request = await PermissionRequest.findOne({
      _id: requestId,
      userId,
      userRole: role
    });
    
    if (!request) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: request
    });
    
  } catch (error) {
    console.error('Get permission request by ID error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching permission request' 
    });
  }
};

// @desc    Update permission request
// @route   PUT /api/:role/permission-request/:requestId
// @access  Private
const updatePermissionRequest = async (req, res) => {
  try {
    const { role, requestId } = req.params;
    const userId = req.user.id;
    
    // Validate role
    if (!['doctor', 'midwife', 'service_provider'].includes(role)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid role' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Check if request exists and belongs to user
    const existingRequest = await PermissionRequest.findOne({
      _id: requestId,
      userId,
      userRole: role
    });
    
    if (!existingRequest) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    // Only allow updates if request is pending
    if (existingRequest.status !== 'pending') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Cannot update request that is not pending' 
      });
    }
    
    // Extract updateable fields based on role
    const updateData = {};
    
    if (role === 'doctor') {
      if (req.body.specialization) updateData['requestDetails.specialization'] = req.body.specialization;
      if (req.body.licenseNumber) updateData['requestDetails.licenseNumber'] = req.body.licenseNumber;
      if (req.body.hospital) updateData['requestDetails.hospital'] = req.body.hospital;
      if (req.body.experience) updateData['requestDetails.experience'] = req.body.experience;
      if (req.body.education) updateData['requestDetails.education'] = req.body.education;
      if (req.body.certifications) updateData['requestDetails.certifications'] = req.body.certifications;
    } else if (role === 'midwife') {
      if (req.body.certificationNumber) updateData['requestDetails.certificationNumber'] = req.body.certificationNumber;
      if (req.body.clinic) updateData['requestDetails.clinic'] = req.body.clinic;
      if (req.body.experience) updateData['requestDetails.experience'] = req.body.experience;
      if (req.body.services) updateData['requestDetails.services'] = req.body.services;
    } else if (role === 'service_provider') {
      if (req.body.businessName) updateData['requestDetails.businessName'] = req.body.businessName;
      if (req.body.businessType) updateData['requestDetails.businessType'] = req.body.businessType;
      if (req.body.registrationNumber) updateData['requestDetails.registrationNumber'] = req.body.registrationNumber;
      if (req.body.businessServices) updateData['requestDetails.businessServices'] = req.body.businessServices;
    }
    
    // Common fields
    if (req.body.additionalInfo) updateData['requestDetails.additionalInfo'] = req.body.additionalInfo;
    if (req.body.reason) updateData['requestDetails.reason'] = req.body.reason;
    if (req.body.documents) updateData.documents = req.body.documents;
    if (req.body.priority) updateData.priority = req.body.priority;
    if (req.body.isUrgent !== undefined) updateData.isUrgent = req.body.isUrgent;
    
    // Update the request
    const updatedRequest = await PermissionRequest.findByIdAndUpdate(
      requestId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Permission request updated successfully',
      data: updatedRequest
    });
    
  } catch (error) {
    console.error('Update permission request error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while updating permission request' 
    });
  }
};

// @desc    Cancel permission request
// @route   DELETE /api/:role/permission-request/:requestId
// @access  Private
const cancelPermissionRequest = async (req, res) => {
  try {
    const { role, requestId } = req.params;
    const userId = req.user.id;
    
    // Validate role
    if (!['doctor', 'midwife', 'service_provider'].includes(role)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid role' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Check if request exists and belongs to user
    const existingRequest = await PermissionRequest.findOne({
      _id: requestId,
      userId,
      userRole: role
    });
    
    if (!existingRequest) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    // Only allow cancellation if request is pending
    if (existingRequest.status !== 'pending') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Cannot cancel request that is not pending' 
      });
    }
    
    // Delete the request
    await PermissionRequest.findByIdAndDelete(requestId);
    
    res.status(200).json({
      status: 'success',
      message: 'Permission request cancelled successfully'
    });
    
  } catch (error) {
    console.error('Cancel permission request error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while cancelling permission request' 
    });
  }
};

module.exports = {
  submitPermissionRequest,
  getUserPermissionRequests,
  getPermissionRequestById,
  updatePermissionRequest,
  cancelPermissionRequest
};
