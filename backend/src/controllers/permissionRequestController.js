const getPermissionRequestModel = require('../models/PermissionRequest');
const getUserModel = require('../models/User');

// @desc    Submit permission request
// @route   POST /api/permission-requests
// @access  Private
const submitPermissionRequest = async (req, res) => {
  try {
    const { userRole, ...requestData } = req.body;
    const userId = req.user._id;
    
    // Validate user role
    if (!['doctor', 'midwife', 'service_provider'].includes(userRole)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid user role for permission request'
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();

    // Check if user already has a pending request for this role
    const existingRequest = await PermissionRequest.findOne({
      user: userId,
      userRole: userRole,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'You already have a pending permission request for this role' 
      });
    }
    
    // Create permission request
    const permissionRequest = await PermissionRequest.create({
      user: userId,
      userRole: userRole,
      ...requestData
    });

    // Populate user details for response
    await permissionRequest.populate('user', 'firstName lastName email role');
    
    res.status(201).json({
      status: 'success',
      message: 'Permission request submitted successfully',
      data: permissionRequest
    });
  } catch (error) {
    console.error('Error submitting permission request:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to submit permission request',
      error: error.message
    });
  }
};

// @desc    Get permission requests (for admin)
// @route   GET /api/permission-requests
// @access  Private (Admin)
const getPermissionRequests = async (req, res) => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (role) query.userRole = role;

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get requests with pagination and populate user data
    const requests = await PermissionRequest.find(query)
      .populate('user', 'firstName lastName email role')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await PermissionRequest.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting permission requests:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to get permission requests',
      error: error.message
    });
  }
};

// @desc    Get permission request by ID
// @route   GET /api/permission-requests/:id
// @access  Private (Admin)
const getPermissionRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const PermissionRequest = getPermissionRequestModel();

    const request = await PermissionRequest.findById(id)
      .populate('user', 'firstName lastName email role');
    
    if (!request) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    res.json({
      status: 'success',
      data: request
    });
  } catch (error) {
    console.error('Error getting permission request:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to get permission request',
      error: error.message
    });
  }
};

// @desc    Approve permission request
// @route   PUT /api/permission-requests/:id/approve
// @access  Private (Admin)
const approvePermissionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.adminUser._id;
    
    const PermissionRequest = getPermissionRequestModel();
    const request = await PermissionRequest.findById(id);
    if (!request) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Request has already been processed'
      });
    }

    // Approve the request
    await request.approve(adminId, notes);

    // Update user's hasPermission field
    const User = getUserModel();
    await User.findByIdAndUpdate(request.user, {
      hasPermission: true
    });

    // Note: User data will be handled separately if needed

    res.json({
      status: 'success',
      message: 'Permission request approved successfully',
      data: request
    });
  } catch (error) {
    console.error('Error approving permission request:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to approve permission request',
      error: error.message
    });
  }
};

// @desc    Reject permission request
// @route   PUT /api/permission-requests/:id/reject
// @access  Private (Admin)
const rejectPermissionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.adminUser._id;
    
    const PermissionRequest = getPermissionRequestModel();
    const request = await PermissionRequest.findById(id);
    if (!request) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Request has already been processed'
      });
    }

    // Reject the request
    await request.reject(adminId, notes);

    // Note: User data will be handled separately if needed

    res.json({
      status: 'success',
      message: 'Permission request rejected successfully',
      data: request
    });
  } catch (error) {
    console.error('Error rejecting permission request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject permission request',
      error: error.message
    });
  }
};

// @desc    Get user's permission requests
// @route   GET /api/permission-requests/user/me
// @access  Private
const getUserPermissionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const PermissionRequest = getPermissionRequestModel();

    const requests = await PermissionRequest.find({ user: userId })
      .populate('user', 'firstName lastName email role')
      .sort({ submittedAt: -1 });

    res.json({
      status: 'success',
      data: requests
    });
  } catch (error) {
    console.error('Error getting user permission requests:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user permission requests',
      error: error.message
    });
  }
};

// @desc    Get permission request statistics
// @route   GET /api/permission-requests/stats
// @access  Private (Admin)
const getPermissionRequestStats = async (req, res) => {
  try {
    const PermissionRequest = getPermissionRequestModel();

    const stats = await PermissionRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const roleStats = await PermissionRequest.aggregate([
      {
        $group: {
          _id: { status: '$status', role: '$userRole' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await PermissionRequest.countDocuments();
    const pendingRequests = await PermissionRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await PermissionRequest.countDocuments({ status: 'approved' });
    const rejectedRequests = await PermissionRequest.countDocuments({ status: 'rejected' });

    res.json({
      status: 'success',
      data: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        statusBreakdown: stats,
        roleBreakdown: roleStats
      }
    });
  } catch (error) {
    console.error('Error getting permission request stats:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to get permission request statistics',
      error: error.message
    });
  }
};

module.exports = {
  submitPermissionRequest,
  getPermissionRequests,
  getPermissionRequestById,
  approvePermissionRequest,
  rejectPermissionRequest,
  getUserPermissionRequests,
  getPermissionRequestStats
};
