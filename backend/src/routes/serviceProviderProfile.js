const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/fileUpload');
const {
  getServiceProviderProfile,
  createServiceProviderProfile,
  updateServiceProviderProfile,
  uploadProfileImage,
  getProfileStats,
  updateProfileStats,
  getAllServiceProviderProfiles,
  updateProfileStatus
} = require('../controllers/serviceProviderProfileController');

// Service Provider Profile Routes (Protected - Service Provider only)
router.use(protect);
router.use(authorize('service_provider'));

// Profile management routes
router.route('/')
  .get(getServiceProviderProfile)
  .post(createServiceProviderProfile)
  .put(updateServiceProviderProfile);

// Profile image upload
router.post('/image', upload.single('profileImage'), uploadProfileImage);

// Profile statistics
router.route('/stats')
  .get(getProfileStats)
  .put(updateProfileStats);

// Admin Routes (Protected - Admin only)
router.use(authorize('admin'));

// Get all service provider profiles (Admin)
router.get('/admin/all', getAllServiceProviderProfiles);

// Update profile status (Admin)
router.put('/admin/:id/status', updateProfileStatus);

module.exports = router;
