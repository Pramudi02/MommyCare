const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/service-provider/permission-request:
 *   post:
 *     summary: Submit service provider permission request
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               businessPhone:
 *                 type: string
 *               businessEmail:
 *                 type: string
 *               businessType:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               taxId:
 *                 type: string
 *               yearsInBusiness:
 *                 type: string
 *               services:
 *                 type: array
 *               products:
 *                 type: array
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
router.post('/permission-request', protect, authorize('service_provider'), asyncHandler(async (req, res) => {
  // TODO: Implement permission request logic
  // For now, just return success
  res.status(201).json({
    status: 'success',
    message: 'Permission request submitted successfully'
  });
}));

router.get('/dashboard', (req, res) => {
	res.json({ status: 'success', data: { message: 'Service Provider dashboard endpoint (stub)' } });
});

router.get('/products', (req, res) => {
	res.json({ status: 'success', data: [] });
});

router.get('/orders', (req, res) => {
	res.json({ status: 'success', data: [] });
});

module.exports = router;
