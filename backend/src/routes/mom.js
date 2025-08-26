const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const getClinicVisitRequestModel = require('../models/ClinicVisitRequest');
const DoctorVisitRequest = require('../models/DoctorVisitRequest');
const getVaccinationRecordModel = require('../models/VaccinationRecord');


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

		const ClinicVisitRequest = getClinicVisitRequestModel();

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
		const ClinicVisitRequest = getClinicVisitRequestModel();
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
		const ClinicVisitRequest = getClinicVisitRequestModel();
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
		
		const ClinicVisitRequest = getClinicVisitRequestModel();
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

		// Update the request
		const updatedRequest = await ClinicVisitRequest.findByIdAndUpdate(
			req.params.id,
			{
				requestType: requestType || request.requestType,
				preferredDate: preferredDate ? new Date(preferredDate) : request.preferredDate,
				preferredTime: preferredTime || request.preferredTime,
				notes: notes !== undefined ? notes : request.notes,
				location: location || request.location
			},
			{ new: true, runValidators: true }
		).populate('mom', 'firstName lastName email');

		res.json({
			status: 'success',
			message: 'Clinic visit request updated successfully',
			data: updatedRequest
		});
	} catch (err) {
		next(err);
	}
});

// Cancel a clinic visit request
router.patch('/clinic-visit-requests/:id/cancel', protect, async (req, res, next) => {
	try {
		const ClinicVisitRequest = getClinicVisitRequestModel();
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

		// Update status to cancelled
		const updatedRequest = await ClinicVisitRequest.findByIdAndUpdate(
			req.params.id,
			{ status: 'cancelled' },
			{ new: true, runValidators: true }
		).populate('mom', 'firstName lastName email');

		res.json({
			status: 'success',
			message: 'Clinic visit request cancelled successfully',
			data: updatedRequest
		});
	} catch (err) {
		next(err);
	}
});

// Doctor Visit Requests (Mom)
// Create a new doctor visit request
router.post('/doctor-visit-requests', protect, async (req, res, next) => {
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
		const request = await DoctorVisitRequest.create({
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
			message: 'Doctor visit request created successfully',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

// Get all doctor visit requests for the current mom
router.get('/doctor-visit-requests', protect, async (req, res, next) => {
	try {
		const requests = await DoctorVisitRequest.find({ mom: req.user._id })
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

// Get a specific doctor visit request by ID
router.get('/doctor-visit-requests/:id', protect, async (req, res, next) => {
	try {
		const request = await DoctorVisitRequest.findOne({
			_id: req.params.id,
			mom: req.user._id
		}).populate('mom', 'firstName lastName email');

		if (!request) {
			return res.status(404).json({
				status: 'error',
				message: 'Doctor visit request not found'
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

// Update a doctor visit request
router.put('/doctor-visit-requests/:id', protect, async (req, res, next) => {
	try {
		const { requestType, preferredDate, preferredTime, notes, location } = req.body;
		
		const request = await DoctorVisitRequest.findOne({
			_id: req.params.id,
			mom: req.user._id
		});

		if (!request) {
			return res.status(404).json({
				status: 'error',
				message: 'Doctor visit request not found'
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
			message: 'Doctor visit request updated successfully',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

// Cancel a doctor visit request
router.patch('/doctor-visit-requests/:id/cancel', protect, async (req, res, next) => {
	try {
		const request = await DoctorVisitRequest.findOne({
			_id: req.params.id,
			mom: req.user._id
		});

		if (!request) {
			return res.status(404).json({
				status: 'error',
				message: 'Doctor visit request not found'
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
			message: 'Doctor visit request cancelled successfully',
			data: request
		});
	} catch (err) {
		next(err);
	}
});

// ==================== VACCINATION ROUTES ====================

/**
 * @swagger
 * /api/mom/vaccinations:
 *   get:
 *     summary: Get all vaccination records for a baby
 *     tags: [Mom, Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vaccination records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *       401:
 *         description: Not authorized
 */
router.get('/vaccinations', protect, async (req, res, next) => {
	try {
		const VaccinationRecord = getVaccinationRecordModel();
		
		// For now, we'll use the mom's ID as the baby ID
		// In a real system, you'd have a separate baby/child model
		const babyId = req.user._id;
		
		const vaccinations = await VaccinationRecord.getAllForBaby(babyId);
		
		res.json({
			status: 'success',
			data: vaccinations
		});
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/mom/vaccinations/request-appointment:
 *   post:
 *     summary: Request vaccination appointment
 *     tags: [Mom, Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vaccine
 *               - preferredDate
 *               - preferredTime
 *               - location
 *             properties:
 *               vaccine:
 *                 type: string
 *               preferredDate:
 *                 type: string
 *                 format: date
 *               preferredTime:
 *                 type: string
 *                 enum: [Morning, Afternoon, Evening, Any Time]
 *               location:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vaccination appointment request created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
router.post('/vaccinations/request-appointment', protect, async (req, res, next) => {
	try {
		const { vaccine, preferredDate, preferredTime, location, notes } = req.body;
		
		// Validate required fields
		if (!vaccine || !preferredDate || !preferredTime || !location) {
			return res.status(400).json({
				status: 'error',
				message: 'Missing required fields: vaccine, preferredDate, preferredTime, location'
			});
		}

		const ClinicVisitRequest = getClinicVisitRequestModel();

		// Create clinic visit request for vaccination
		const request = await ClinicVisitRequest.create({
			mom: req.user._id,
			requestType: 'Vaccinations',
			preferredDate: new Date(preferredDate),
			preferredTime,
			notes: notes || `Vaccination appointment requested for: ${vaccine}`,
			location,
			status: 'pending'
		});

		// Populate mom details for response
		await request.populate('mom', 'firstName lastName email');

		res.status(201).json({
			status: 'success',
			message: 'Vaccination appointment request created successfully',
			data: {
				request,
				redirectTo: '/mom/appointments',
				highlightSection: 'vaccinations',
				requestType: 'Vaccinations',
				vaccineName: vaccine,
				appointmentId: request._id
			}
		});
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/mom/vaccinations/initialize:
 *   post:
 *     summary: Initialize vaccination schedule for a baby
 *     tags: [Mom, Vaccinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - babyBirthDate
 *             properties:
 *               babyBirthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Vaccination schedule initialized successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
router.post('/vaccinations/initialize', protect, async (req, res, next) => {
	try {
		const { babyBirthDate } = req.body;
		
		if (!babyBirthDate) {
			return res.status(400).json({
				status: 'error',
				message: 'Baby birth date is required'
			});
		}

		const VaccinationRecord = getVaccinationRecordModel();
		const birthDate = new Date(babyBirthDate);
		
		// Standard vaccination schedule
		const vaccinationSchedule = [
			{
				vaccine: 'B.C.G (Bacillus Calmette-Guérin)',
				recommendedAge: 'At birth',
				dueDate: new Date(birthDate),
				status: 'completed',
				vaccinationDate: new Date(birthDate),
				batchNo: 'BCG-2025-001',
				adverseEffects: 'Mild swelling at injection site',
				bcgScar: true,
				lastGiven: new Date(birthDate).toLocaleDateString(),
				recommendation: 'At birth'
			},
			{
				vaccine: 'B.C.G Second Dose',
				recommendedAge: 'At birth',
				dueDate: new Date(birthDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
				status: 'due',
				adverseEffects: 'None reported',
				recommendation: 'At birth'
			},
			{
				vaccine: 'Pentavalent 1 + OPV 1',
				recommendedAge: '2 months completed',
				dueDate: new Date(birthDate.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days later
				status: 'upcoming',
				adverseEffects: 'Fever, mild fussiness',
				recommendation: '2 months completed'
			},
			{
				vaccine: 'Pentavalent 2 + OPV 2 + IPV',
				recommendedAge: '4 months completed',
				dueDate: new Date(birthDate.getTime() + 120 * 24 * 60 * 60 * 1000), // 120 days later
				status: 'upcoming',
				adverseEffects: 'Soreness at injection site',
				recommendation: '4 months completed'
			},
			{
				vaccine: 'Pentavalent 3 + OPV 3',
				recommendedAge: '6 months completed',
				dueDate: new Date(birthDate.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days later
				status: 'upcoming',
				adverseEffects: 'Low-grade fever',
				recommendation: '6 months completed'
			},
			{
				vaccine: 'MMR 1 (Measles, Mumps, Rubella)',
				recommendedAge: '9 months completed',
				dueDate: new Date(birthDate.getTime() + 270 * 24 * 60 * 60 * 1000), // 270 days later
				status: 'upcoming',
				adverseEffects: 'Rash, fever',
				recommendation: '9 months completed'
			},
			{
				vaccine: 'Live JE (Japanese Encephalitis)',
				recommendedAge: '12 months completed',
				dueDate: new Date(birthDate.getTime() + 365 * 24 * 60 * 60 * 1000), // 365 days later
				status: 'upcoming',
				adverseEffects: 'Headache, fever',
				recommendation: '12 months completed'
			},
			{
				vaccine: 'DPT + OPV 4',
				recommendedAge: '18 months completed',
				dueDate: new Date(birthDate.getTime() + 547 * 24 * 60 * 60 * 1000), // 547 days later
				status: 'upcoming',
				adverseEffects: 'Soreness, fever',
				recommendation: '18 months completed'
			},
			{
				vaccine: 'MMR 2 (Measles, Mumps, Rubella)',
				recommendedAge: '3 years completed',
				dueDate: new Date(birthDate.getTime() + 1095 * 24 * 60 * 60 * 1000), // 1095 days later
				status: 'upcoming',
				adverseEffects: 'Mild rash',
				recommendation: '3 years completed'
			},
			{
				vaccine: 'D.T + OPV 5',
				recommendedAge: '5 years completed',
				dueDate: new Date(birthDate.getTime() + 1825 * 24 * 60 * 60 * 1000), // 1825 days later
				status: 'upcoming',
				adverseEffects: 'Soreness at injection site',
				recommendation: '5 years completed'
			},
			{
				vaccine: 'Adult Tetanus & Diphtheria',
				recommendedAge: '11 years completed',
				dueDate: new Date(birthDate.getTime() + 4015 * 24 * 60 * 60 * 1000), // 4015 days later
				status: 'upcoming',
				adverseEffects: 'Soreness, mild fever',
				recommendation: '11 years completed'
			}
		];

		// Create vaccination records for the baby
		const babyId = req.user._id; // For now, using mom's ID as baby ID
		const vaccinationRecords = await VaccinationRecord.insertMany(
			vaccinationSchedule.map(schedule => ({
				...schedule,
				baby: babyId
			}))
		);

		res.status(201).json({
			status: 'success',
			message: 'Vaccination schedule initialized successfully',
			data: vaccinationRecords
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
