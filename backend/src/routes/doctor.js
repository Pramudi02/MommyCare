const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/doctor/permission-request:
 *   post:
 *     summary: Submit doctor permission request
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hospitalName:
 *                 type: string
 *               hospitalAddress:
 *                 type: string
 *               hospitalPhone:
 *                 type: string
 *               hospitalEmail:
 *                 type: string
 *               doctorSpecialization:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               yearsOfExperience:
 *                 type: string
 *               location:
 *                 type: object
 *     responses:
 *       201:
 *         description: Permission request submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post('/permission-request', protect, authorize('doctor'), asyncHandler(async (req, res) => {
  // TODO: Implement permission request logic
  // For now, just return success
  res.status(201).json({
    status: 'success',
    message: 'Permission request submitted successfully'
  });
}));

router.get('/dashboard', (req, res) => {
	res.json({ status: 'success', data: { message: 'Doctor dashboard endpoint (stub)' } });
});

router.get('/patients', (req, res) => {
	res.json({ status: 'success', data: [] });
});

router.get('/appointments', (req, res) => {
	res.json({ status: 'success', data: [] });
});

module.exports = router;
