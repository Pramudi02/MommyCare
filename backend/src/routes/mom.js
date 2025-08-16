const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ClinicVisitRequest = require('../models/ClinicVisitRequest');

/**
 * @swagger
 * /api/mom/profile:
 *   get:
 *     summary: Get mom profile information
 *     tags: [Mom]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mom profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authorized
 */
router.get('/profile', (req, res) => {
	res.json({ status: 'success', data: { message: 'Mom profile endpoint (stub)' } });
});

router.get('/medical-records', (req, res) => {
	res.json({ status: 'success', data: [] });
});

router.get('/appointments', (req, res) => {
	res.json({ status: 'success', data: [] });
});

// Clinic Visit Requests (Mom)
// Create a new clinic visit request
router.post('/clinic-visit-requests', protect, async (req, res, next) => {
	try {
		const { requestType, preferredDate, preferredTime, notes, location } = req.body;
		
		// Validate required fields
		if (!requestType || !preferredDate || !preferredTime || !location) {
			return res.status(400).json({
				status: 'error',
				message: 'Missing required fields: requestType, preferredDate, preferredTime, location'
			});
		}

		// Create the request
		const request = await ClinicVisitRequest.create({
			mom: req.user._id,
			requestType,
			preferredDate: new Date(preferredDate),
			preferredTime,
			notes: notes || '',
			location,
			status: 'pending'
		});

		// Populate mom details for response
		await request.populate('mom', 'firstName lastName email');

		res.status(201).json({
			status: 'success',
			message: 'Clinic visit request created successfully',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

// Get all clinic visit requests for the current mom
router.get('/clinic-visit-requests', protect, async (req, res, next) => {
	try {
		const requests = await ClinicVisitRequest.find({ mom: req.user._id })
			.sort({ createdAt: -1 })
			.populate('mom', 'firstName lastName email');

		res.json({
			status: 'success',
			data: requests
		});
	} catch (err) {
		next(err);
	}
});

// Get a specific clinic visit request by ID
router.get('/clinic-visit-requests/:id', protect, async (req, res, next) => {
	try {
		const request = await ClinicVisitRequest.findOne({
			_id: req.params.id,
			mom: req.user._id
		}).populate('mom', 'firstName lastName email');

		if (!request) {
			return res.status(404).json({
				status: 'error',
				message: 'Clinic visit request not found'
			});
		}

		res.json({
			status: 'success',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

// Update a clinic visit request
router.put('/clinic-visit-requests/:id', protect, async (req, res, next) => {
	try {
		const { requestType, preferredDate, preferredTime, notes, location } = req.body;
		
		const request = await ClinicVisitRequest.findOne({
			_id: req.params.id,
			mom: req.user._id
		});

		if (!request) {
			return res.status(404).json({
				status: 'error',
				message: 'Clinic visit request not found'
			});
		}

		// Only allow updates if status is pending
		if (request.status !== 'pending') {
			return res.status(400).json({
				status: 'error',
				message: 'Cannot update request that is not pending'
			});
		}

		// Update fields
		if (requestType) request.requestType = requestType;
		if (preferredDate) request.preferredDate = new Date(preferredDate);
		if (preferredTime) request.preferredTime = preferredTime;
		if (notes !== undefined) request.notes = notes;
		if (location) request.location = location;

		await request.save();
		await request.populate('mom', 'firstName lastName email');

		res.json({
			status: 'success',
			message: 'Clinic visit request updated successfully',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

// Cancel a clinic visit request
router.patch('/clinic-visit-requests/:id/cancel', protect, async (req, res, next) => {
	try {
		const request = await ClinicVisitRequest.findOne({
			_id: req.params.id,
			mom: req.user._id
		});

		if (!request) {
			return res.status(404).json({
				status: 'error',
				message: 'Clinic visit request not found'
			});
		}

		// Only allow cancellation if status is pending
		if (request.status !== 'pending') {
			return res.status(400).json({
				status: 'error',
				message: 'Cannot cancel request that is not pending'
			});
		}

		request.status = 'cancelled';
		await request.save();

		res.json({
			status: 'success',
			message: 'Clinic visit request cancelled successfully',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
