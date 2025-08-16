const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { protectAdmin } = require('../middleware/adminAuth');

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  updateAdminProfile,
  updateAdminPassword
} = require('../controllers/adminAuthController');

const {
  getAllPermissionRequests,
  getPermissionRequestById,
  updatePermissionRequestStatus,
  addAdminNote,
  getPermissionRequestStats,
  bulkUpdatePermissionRequests
} = require('../controllers/adminPermissionController');

const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/adminUserController');

const router = express.Router();

// Validation middleware
const validateAdminRegistration = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['super_admin', 'admin', 'moderator']).withMessage('Invalid admin role')
];

const validateAdminLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateAdminProfileUpdate = [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
];

const validateAdminPasswordUpdate = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const validateStatusUpdate = [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
];

const validateAdminNote = [
  body('note').trim().notEmpty().withMessage('Note cannot be empty')
];

const validateBulkUpdate = [
  body('requestIds').isArray().withMessage('Request IDs must be an array'),
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
];

// Validation middleware for user management
const validateUserStatusUpdate = [
  body('isActive').isBoolean().withMessage('isActive must be a boolean value')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Test endpoint to check admin database connectivity
router.get('/test-db', async (req, res) => {
  try {
    const getAdminUserModel = require('../models/AdminUser');
    const AdminUser = getAdminUserModel();
    const count = await AdminUser.countDocuments();
    res.json({ 
      status: 'success', 
      message: 'Admin database connection working',
      adminUserCount: count
    });
  } catch (error) {
    console.error('Admin database test error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Admin database connection failed',
      error: error.message
    });
  }
});

// Admin authentication routes
router.post('/register', validateAdminRegistration, handleValidationErrors, asyncHandler(registerAdmin));
router.post('/login', validateAdminLogin, handleValidationErrors, asyncHandler(loginAdmin));
router.post('/logout', asyncHandler(logoutAdmin));
router.get('/me', protectAdmin, asyncHandler(getAdminMe));
router.put('/profile', validateAdminProfileUpdate, handleValidationErrors, protectAdmin, asyncHandler(updateAdminProfile));
router.put('/password', validateAdminPasswordUpdate, handleValidationErrors, protectAdmin, asyncHandler(updateAdminPassword));

// User management routes (admin only)
router.get('/users', protectAdmin, asyncHandler(getAllUsers));
router.get('/users/stats', protectAdmin, asyncHandler(getUserStats));
router.get('/users/:id', protectAdmin, asyncHandler(getUserById));
router.patch('/users/:id/status', validateUserStatusUpdate, handleValidationErrors, protectAdmin, asyncHandler(updateUserStatus));
router.delete('/users/:id', protectAdmin, asyncHandler(deleteUser));

// Permission request management routes (admin only)
router.get('/permission-requests', protectAdmin, asyncHandler(getAllPermissionRequests));
router.get('/permission-requests/stats', protectAdmin, asyncHandler(getPermissionRequestStats));
router.get('/permission-request/:requestId', protectAdmin, asyncHandler(getPermissionRequestById));
router.put('/permission-request/:requestId/status', validateStatusUpdate, handleValidationErrors, protectAdmin, asyncHandler(updatePermissionRequestStatus));
router.post('/permission-request/:requestId/notes', validateAdminNote, handleValidationErrors, protectAdmin, asyncHandler(addAdminNote));
router.put('/permission-requests/bulk-update', validateBulkUpdate, handleValidationErrors, protectAdmin, asyncHandler(bulkUpdatePermissionRequests));

module.exports = router;
