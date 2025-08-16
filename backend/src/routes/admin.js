const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

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

const router = express.Router();

// Validation middleware for admin operations
const validateAdminRegistration = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['super_admin', 'admin', 'moderator']).withMessage('Invalid admin role'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array')
];

const validateAdminLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateAdminPasswordUpdate = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

const validateAdminProfileUpdate = [
  body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array')
];

// Validation middleware for permission request management
const validateStatusUpdate = [
  body('status').isIn(['pending', 'approved', 'rejected', 'under_review']).withMessage('Invalid status'),
  body('rejectionReason').optional().isString().withMessage('Rejection reason must be a string'),
  body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
];

const validateBulkUpdate = [
  body('requestIds').isArray().withMessage('Request IDs must be an array'),
  body('status').isIn(['pending', 'approved', 'rejected', 'under_review']).withMessage('Invalid status'),
  body('rejectionReason').optional().isString().withMessage('Rejection reason must be a string'),
  body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
];

const validateAdminNote = [
  body('note').notEmpty().withMessage('Note content is required')
];

// Check for validation errors
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

// Async error handler wrapper
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
router.get('/me', protect, asyncHandler(getAdminMe));
router.put('/profile', validateAdminProfileUpdate, handleValidationErrors, protect, asyncHandler(updateAdminProfile));
router.put('/password', validateAdminPasswordUpdate, handleValidationErrors, protect, asyncHandler(updateAdminPassword));

// Permission request management routes (admin only)
router.get('/permission-requests', protect, asyncHandler(getAllPermissionRequests));
router.get('/permission-requests/stats', protect, asyncHandler(getPermissionRequestStats));
router.get('/permission-request/:requestId', protect, asyncHandler(getPermissionRequestById));
router.put('/permission-request/:requestId/status', validateStatusUpdate, handleValidationErrors, protect, asyncHandler(updatePermissionRequestStatus));
router.post('/permission-request/:requestId/notes', validateAdminNote, handleValidationErrors, protect, asyncHandler(addAdminNote));
router.put('/permission-requests/bulk-update', validateBulkUpdate, handleValidationErrors, protect, asyncHandler(bulkUpdatePermissionRequests));

module.exports = router;
