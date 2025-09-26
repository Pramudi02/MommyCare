const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { protectAdmin } = require('../middleware/adminAuth');
const {
  submitPermissionRequest,
  getPermissionRequests,
  getPermissionRequestById,
  approvePermissionRequest,
  rejectPermissionRequest,
  getUserPermissionRequests,
  getPermissionRequestStats
} = require('../controllers/permissionRequestController');

const router = express.Router();

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes (require authentication)
router.post('/', protect, asyncHandler(submitPermissionRequest));
router.get('/user/me', protect, asyncHandler(getUserPermissionRequests));

// Admin routes (require admin authorization)
router.get('/', protectAdmin, asyncHandler(getPermissionRequests));
router.get('/stats', protectAdmin, asyncHandler(getPermissionRequestStats));
router.get('/:id', protectAdmin, asyncHandler(getPermissionRequestById));
router.put('/:id/approve', protectAdmin, asyncHandler(approvePermissionRequest));
router.put('/:id/reject', protectAdmin, asyncHandler(rejectPermissionRequest));

module.exports = router;
