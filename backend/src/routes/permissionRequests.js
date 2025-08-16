const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

const {
  submitPermissionRequest,
  getUserPermissionRequests,
  getPermissionRequestById,
  updatePermissionRequest,
  cancelPermissionRequest
} = require('../controllers/permissionRequestController');

const router = express.Router();

// Validation middleware for permission requests
const validatePermissionRequest = [
  body('specialization').optional().isString().withMessage('Specialization must be a string'),
  body('licenseNumber').optional().isString().withMessage('License number must be a string'),
  body('hospital').optional().isString().withMessage('Hospital must be a string'),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('education').optional().isArray().withMessage('Education must be an array'),
  body('certifications').optional().isArray().withMessage('Certifications must be an array'),
  
  // Midwife specific
  body('certificationNumber').optional().isString().withMessage('Certification number must be a string'),
  body('clinic').optional().isString().withMessage('Clinic must be a string'),
  body('services').optional().isArray().withMessage('Services must be an array'),
  
  // Service provider specific
  body('businessName').optional().isString().withMessage('Business name must be a string'),
  body('businessType').optional().isString().withMessage('Business type must be a string'),
  body('registrationNumber').optional().isString().withMessage('Registration number must be a string'),
  body('businessServices').optional().isArray().withMessage('Business services must be an array'),
  
  // Common fields
  body('additionalInfo').optional().isString().withMessage('Additional info must be a string'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  body('documents').optional().isArray().withMessage('Documents must be an array'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  body('isUrgent').optional().isBoolean().withMessage('Is urgent must be a boolean')
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

// Test endpoint to check permission request system
router.get('/test', async (req, res) => {
  try {
    const getPermissionRequestModel = require('../models/PermissionRequest');
    const PermissionRequest = getPermissionRequestModel();
    const count = await PermissionRequest.countDocuments();
    res.json({ 
      status: 'success', 
      message: 'Permission request system working',
      totalRequests: count
    });
  } catch (error) {
    console.error('Permission request test error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Permission request system failed',
      error: error.message
    });
  }
});

// Permission request routes
router.post('/:role/permission-request', validatePermissionRequest, handleValidationErrors, protect, asyncHandler(submitPermissionRequest));
router.get('/:role/permission-requests', protect, asyncHandler(getUserPermissionRequests));
router.get('/:role/permission-request/:requestId', protect, asyncHandler(getPermissionRequestById));
router.put('/:role/permission-request/:requestId', validatePermissionRequest, handleValidationErrors, protect, asyncHandler(updatePermissionRequest));
router.delete('/:role/permission-request/:requestId', protect, asyncHandler(cancelPermissionRequest));

module.exports = router;
