const getUserModel = require('../models/User');

// @desc    Get all users with pagination and filtering
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    if (status && status !== 'all') {
      filter.isActive = status === 'active';
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const User = getUserModel();
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    
    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Transform users data
    const transformedUsers = users.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.isActive ? 'Active' : 'Inactive',
      lastLogin: user.lastLogin || 'Never',
      location: user.location || 'Not specified',
      phone: user.phone || 'Not specified',
      joinDate: user.createdAt.toISOString().split('T')[0],
      avatar: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
      avatarColor: getAvatarColor(user.role)
    }));
    
    // Get role statistics
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      total: totalUsers,
      active: await User.countDocuments({ isActive: true }),
      inactive: await User.countDocuments({ isActive: false }),
      mothers: await User.countDocuments({ role: 'mom' }),
      doctors: await User.countDocuments({ role: 'doctor' }),
      midwives: await User.countDocuments({ role: 'midwife' }),
      serviceProviders: await User.countDocuments({ role: 'service_provider' })
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        users: transformedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        },
        stats
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching users' 
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const User = getUserModel();
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching user' 
    });
  }
};

// @desc    Update user status (activate/deactivate)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'isActive must be a boolean value' 
      });
    }
    
    const User = getUserModel();
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while updating user status' 
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const User = getUserModel();
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while deleting user' 
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private (Admin only)
const getUserStats = async (req, res) => {
  try {
    const User = getUserModel();
    
    // Get total counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    // Get role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get monthly registrations for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          recentRegistrations
        },
        roleDistribution,
        monthlyRegistrations
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error while fetching user statistics' 
    });
  }
};

// Helper function to get avatar color based on role
const getAvatarColor = (role) => {
  const colors = {
    mom: 'pink',
    doctor: 'blue',
    midwife: 'green',
    service_provider: 'purple'
  };
  return colors[role] || 'gray';
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
};
