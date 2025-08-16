const getPermissionRequestModel = require('../models/PermissionRequest');
const getUserModel = require('../models/User');

// @desc    Get all permission requests (admin view)
// @route   GET /api/admin/permission-requests
// @access  Private (Admin only)
const getAllPermissionRequests = async (req, res) => {
  try {
    const { status, role, priority, page = 1, limit = 10 } = req.query;
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.userRole = role;
    if (priority) filter.priority = priority;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get requests with pagination
    const requests = await PermissionRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await PermissionRequest.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
          hasNext: skip + requests.length < total,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get all permission requests error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching permission requests' 
    });
  }
};

// @desc    Get permission request by ID (admin view)
// @route   GET /api/admin/permission-request/:requestId
// @access  Private (Admin only)
const getPermissionRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const PermissionRequest = getPermissionRequestModel();
    const request = await PermissionRequest.findById(requestId);
    
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

// @desc    Update permission request status (admin action)
// @route   PUT /api/admin/permission-request/:requestId/status
// @access  Private (Admin only)
const updatePermissionRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason, adminNotes } = req.body;
    const adminId = req.user.id;
    const adminUsername = req.user.username;
    
    // Validate status
    if (!['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid status. Must be pending, approved, rejected, or under_review' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Check if request exists
    const existingRequest = await PermissionRequest.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    // Prepare update data
    const updateData = {
      status,
      reviewedBy: {
        adminId,
        adminUsername,
        reviewedAt: new Date()
      }
    };
    
    // Add rejection reason if status is rejected
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    // Add admin notes if provided
    if (adminNotes) {
      updateData.$push = {
        adminNotes: {
          adminId,
          adminUsername,
          note: adminNotes,
          timestamp: new Date()
        }
      };
    }
    
    // Update the request
    const updatedRequest = await PermissionRequest.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true, runValidators: true }
    );
    
    // If approved, update user role in Auth database
    if (status === 'approved') {
      try {
        const User = getUserModel();
        await User.findByIdAndUpdate(existingRequest.userId, {
          $set: { isApproved: true }
        });
        console.log(`User ${existingRequest.userId} approved for role ${existingRequest.userRole}`);
      } catch (userUpdateError) {
        console.error('Error updating user approval status:', userUpdateError);
        // Don't fail the request if user update fails
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: `Permission request ${status} successfully`,
      data: updatedRequest
    });
    
  } catch (error) {
    console.error('Update permission request status error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while updating permission request status' 
    });
  }
};

// @desc    Add admin note to permission request
// @route   POST /api/admin/permission-request/:requestId/notes
// @access  Private (Admin only)
const addAdminNote = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { note } = req.body;
    const adminId = req.user.id;
    const adminUsername = req.user.username;
    
    if (!note) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Note content is required' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Check if request exists
    const existingRequest = await PermissionRequest.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Permission request not found' 
      });
    }
    
    // Add the note
    const updatedRequest = await PermissionRequest.findByIdAndUpdate(
      requestId,
      {
        $push: {
          adminNotes: {
            adminId,
            adminUsername,
            note,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Admin note added successfully',
      data: updatedRequest
    });
    
  } catch (error) {
    console.error('Add admin note error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while adding admin note' 
    });
  }
};

// @desc    Get permission request statistics
// @route   GET /api/admin/permission-requests/stats
// @access  Private (Admin only)
const getPermissionRequestStats = async (req, res) => {
  try {
    const PermissionRequest = getPermissionRequestModel();
    
    // Get counts by status
    const statusStats = await PermissionRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get counts by role
    const roleStats = await PermissionRequest.aggregate([
      { $group: { _id: '$userRole', count: { $sum: 1 } } }
    ]);
    
    // Get counts by priority
    const priorityStats = await PermissionRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Get urgent requests count
    const urgentCount = await PermissionRequest.countDocuments({ isUrgent: true });
    
    // Get recent requests (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await PermissionRequest.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Format stats
    const stats = {
      byStatus: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byRole: roleStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      urgent: urgentCount,
      recent: recentCount,
      total: await PermissionRequest.countDocuments()
    };
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
    
  } catch (error) {
    console.error('Get permission request stats error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching statistics' 
    });
  }
};

// @desc    Bulk update permission requests
// @route   PUT /api/admin/permission-requests/bulk-update
// @access  Private (Admin only)
const bulkUpdatePermissionRequests = async (req, res) => {
  try {
    const { requestIds, status, rejectionReason, adminNotes } = req.body;
    const adminId = req.user.id;
    const adminUsername = req.user.username;
    
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Request IDs array is required' 
      });
    }
    
    if (!['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid status' 
      });
    }
    
    const PermissionRequest = getPermissionRequestModel();
    
    // Prepare update data
    const updateData = {
      status,
      reviewedBy: {
        adminId,
        adminUsername,
        reviewedAt: new Date()
      }
    };
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    // Update all requests
    const result = await PermissionRequest.updateMany(
      { _id: { $in: requestIds } },
      updateData
    );
    
    // Add admin notes if provided
    if (adminNotes) {
      for (const requestId of requestIds) {
        await PermissionRequest.findByIdAndUpdate(requestId, {
          $push: {
            adminNotes: {
              adminId,
              adminUsername,
              note: adminNotes,
              timestamp: new Date()
            }
          }
        });
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: `Bulk update completed. ${result.modifiedCount} requests updated.`,
      data: {
        updatedCount: result.modifiedCount,
        totalRequested: requestIds.length
      }
    });
    
  } catch (error) {
    console.error('Bulk update permission requests error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while performing bulk update' 
    });
  }
};

module.exports = {
  getAllPermissionRequests,
  getPermissionRequestById,
  updatePermissionRequestStatus,
  addAdminNote,
  getPermissionRequestStats,
  bulkUpdatePermissionRequests
};
