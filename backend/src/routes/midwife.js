const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const getClinicVisitRequestModel = require('../models/ClinicVisitRequest');
const getMidwifeAppointmentModel = require('../models/MidwifeAppointment');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicVisitRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the request
 *         mom:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *         requestType:
 *           type: string
 *           enum: [Mom Weight Check, Baby Weight Check, Ultrasound Scan, Blood Tests, Vaccinations, General Checkup]
 *           description: Type of clinic visit requested
 *         preferredDate:
 *           type: string
 *           format: date
 *           description: Mom's preferred date for the visit
 *         preferredTime:
 *           type: string
 *           enum: [Morning, Afternoon, Any Time]
 *           description: Mom's preferred time for the visit
 *         location:
 *           type: string
 *           description: Preferred location for the visit
 *         notes:
 *           type: string
 *           description: Additional notes from the mom
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     MidwifeAppointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         mom:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *         midwife:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *         location:
 *           type: object
 *         notes:
 *           type: string
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     PermissionRequest:
 *       type: object
 *       properties:
 *         clinicName:
 *           type: string
 *         clinicAddress:
 *           type: string
 *         clinicPhone:
 *           type: string
 *         clinicEmail:
 *           type: string
 *         midwifeSpecialization:
 *           type: string
 *         certificationNumber:
 *           type: string
 *         licenseNumber:
 *           type: string
 *         yearsOfExperience:
 *           type: string
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         location:
 *           type: object
 *     
 *     AcceptRequestBody:
 *       type: object
 *       required:
 *         - appointmentDate
 *         - startTime
 *         - endTime
 *       properties:
 *         appointmentDate:
 *           type: string
 *           format: date
 *           description: Date for the appointment
 *         startTime:
 *           type: string
 *           format: time
 *           description: Start time for the appointment (HH:MM)
 *         endTime:
 *           type: string
 *           format: time
 *           description: End time for the appointment (HH:MM)
 *         notes:
 *           type: string
 *           description: Additional notes for the appointment
 *         location:
 *           type: object
 *           description: Location details for the appointment
 *     
 *     RejectRequestBody:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           description: Reason for rejecting the request
 *     
 *     CreateAppointmentBody:
 *       type: object
 *       required:
 *         - title
 *         - mom
 *         - startTime
 *         - endTime
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the appointment
 *         mom:
 *           type: string
 *           description: ID of the mom
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the appointment
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the appointment
 *         type:
 *           type: string
 *           description: Type of appointment
 *         location:
 *           type: object
 *           description: Location details
 *         notes:
 *           type: string
 *           description: Additional notes
 *     
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: error
 *         message:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Midwife
 *   description: Midwife management APIs
 */

/**
 * @swagger
 * /api/midwife/permission-request:
 *   post:
 *     summary: Submit midwife permission request
 *     description: Submit a new permission request for midwife access to the platform
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionRequest'
 *     responses:
 *       201:
 *         description: Permission request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/permission-request', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  // TODO: Implement permission request logic
  // For now, just return success
  res.status(201).json({
    status: 'success',
    message: 'Permission request submitted successfully'
  });
}));

// ===== CLINIC VISIT REQUESTS MANAGEMENT =====

/**
 * @swagger
 * /api/midwife/clinic-visit-requests:
 *   get:
 *     summary: Get all clinic visit requests for midwife
 *     description: Retrieve all pending clinic visit requests that the midwife can review
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clinic visit requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClinicVisitRequest'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/clinic-visit-requests', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const ClinicVisitRequest = getClinicVisitRequestModel();
  
  const requests = await ClinicVisitRequest.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('mom', 'firstName lastName email phone');

  res.json({
    status: 'success',
    data: requests
  });
}));

/**
 * @swagger
 * /api/midwife/clinic-visit-requests/{id}:
 *   get:
 *     summary: Get specific clinic visit request
 *     description: Retrieve details of a specific clinic visit request by ID
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clinic visit request ID
 *     responses:
 *       200:
 *         description: Clinic visit request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ClinicVisitRequest'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/clinic-visit-requests/:id', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const ClinicVisitRequest = getClinicVisitRequestModel();
  
  const request = await ClinicVisitRequest.findById(req.params.id)
    .populate('mom', 'firstName lastName email phone');

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
}));

/**
 * @swagger
 * /api/midwife/clinic-visit-requests/{id}/accept:
 *   post:
 *     summary: Accept clinic visit request and create appointment
 *     description: Accept a clinic visit request and automatically create an appointment with the specified details
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clinic visit request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptRequestBody'
 *     responses:
 *       201:
 *         description: Request accepted and appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Clinic visit request accepted and appointment created
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       $ref: '#/components/schemas/MidwifeAppointment'
 *                     updatedRequest:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         status:
 *                           type: string
 *                           example: approved
 *       400:
 *         description: Validation error or request not pending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/clinic-visit-requests/:id/accept', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const { appointmentDate, startTime, endTime, notes, location } = req.body;
  
  if (!appointmentDate || !startTime || !endTime) {
    return res.status(400).json({
      status: 'error',
      message: 'Appointment date, start time, and end time are required'
    });
  }

  const ClinicVisitRequest = getClinicVisitRequestModel();
  const MidwifeAppointment = getMidwifeAppointmentModel();

  // Find and update the clinic visit request
  const request = await ClinicVisitRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({
      status: 'error',
      message: 'Clinic visit request not found'
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      status: 'error',
      message: 'Request is not pending'
    });
  }

  // Create appointment date and time
  const appointmentDateTime = new Date(appointmentDate);
  const [startHours, startMinutes] = startTime.split(':');
  appointmentDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
  
  const endDateTime = new Date(appointmentDate);
  const [endHours, endMinutes] = endTime.split(':');
  endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

  // Create the appointment
  const appointment = await MidwifeAppointment.create({
    title: `${request.requestType} - ${request.mom.firstName || 'Mom'}`,
    description: request.notes || `Appointment for ${request.requestType}`,
    mom: request.mom,
    midwife: req.user._id,
    startTime: appointmentDateTime,
    endTime: endDateTime,
    type: request.requestType,
    location: location || {
      type: 'field-clinic',
      clinicName: request.location
    },
    notes: notes || '',
    appointmentSource: 'clinic-request',
    clinicVisitRequest: request._id,
    priority: 'medium'
  });

  // Update the clinic visit request status
  await ClinicVisitRequest.findByIdAndUpdate(req.params.id, {
    status: 'approved',
    midwife: req.user._id,
    adminNotes: notes || 'Request approved by midwife',
    appointmentDate: appointmentDateTime,
    appointmentTime: startTime
  });

  // Populate mom details for response
  await appointment.populate('mom', 'firstName lastName email');

  res.status(201).json({
    status: 'success',
    message: 'Clinic visit request accepted and appointment created',
    data: {
      appointment,
      updatedRequest: {
        id: request._id,
        status: 'approved'
      }
    }
  });
}));

/**
 * @swagger
 * /api/midwife/clinic-visit-requests/{id}/reject:
 *   post:
 *     summary: Reject clinic visit request
 *     description: Reject a clinic visit request with a reason
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clinic visit request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectRequestBody'
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Clinic visit request rejected successfully
 *       400:
 *         description: Validation error or request not pending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/clinic-visit-requests/:id/reject', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  if (!reason) {
    return res.status(400).json({
      status: 'error',
      message: 'Rejection reason is required'
    });
  }

  const ClinicVisitRequest = getClinicVisitRequestModel();
  
  const request = await ClinicVisitRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({
      status: 'error',
      message: 'Clinic visit request not found'
    });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      status: 'error',
      message: 'Request is not pending'
    });
  }

  // Update request status
  await ClinicVisitRequest.findByIdAndUpdate(req.params.id, {
    status: 'rejected',
    midwife: req.user._id,
    adminNotes: `Rejected: ${reason}`
  });

  res.json({
    status: 'success',
    message: 'Clinic visit request rejected successfully'
  });
}));

// ===== APPOINTMENT MANAGEMENT =====

/**
 * @swagger
 * /api/midwife/appointments:
 *   get:
 *     summary: Get midwife's appointments
 *     description: Retrieve appointments for the authenticated midwife with various view options
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: view
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *           default: all
 *         description: View type for appointments
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for date range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for date range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MidwifeAppointment'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/appointments', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const { view, startDate, endDate } = req.query;
  const MidwifeAppointment = getMidwifeAppointmentModel();
  
  let appointments;
  
  switch (view) {
    case 'today':
      appointments = await MidwifeAppointment.getTodayForMidwife(req.user._id);
      break;
    case 'week':
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      appointments = await MidwifeAppointment.getByDateRange(req.user._id, weekStart, weekEnd);
      break;
    case 'month':
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      appointments = await MidwifeAppointment.getByDateRange(req.user._id, monthStart, monthEnd);
      break;
    case 'all':
    default:
      appointments = await MidwifeAppointment.find({ midwife: req.user._id })
        .sort({ startTime: 1 })
        .populate('mom', 'firstName lastName email');
      break;
  }

  res.json({
    status: 'success',
    data: appointments
  });
}));

/**
 * @swagger
 * /api/midwife/appointments:
 *   post:
 *     summary: Create new appointment
 *     description: Create a new appointment for the authenticated midwife
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentBody'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Appointment created successfully
 *                 data:
 *                   $ref: '#/components/schemas/MidwifeAppointment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/appointments', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeAppointment = getMidwifeAppointmentModel();
  
  const appointment = await MidwifeAppointment.create({
    ...req.body,
    midwife: req.user._id
  });

  await appointment.populate('mom', 'firstName lastName email');

  res.status(201).json({
    status: 'success',
    message: 'Appointment created successfully',
    data: appointment
  });
}));

/**
 * @swagger
 * /api/midwife/appointments/{id}:
 *   get:
 *     summary: Get specific appointment
 *     description: Retrieve details of a specific appointment by ID
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/MidwifeAppointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/appointments/:id', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeAppointment = getMidwifeAppointmentModel();
  
  const appointment = await MidwifeAppointment.findOne({
    _id: req.params.id,
    midwife: req.user._id
  }).populate('mom', 'firstName lastName email');

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found'
    });
  }

  res.json({
    status: 'success',
    data: appointment
  });
}));

/**
 * @swagger
 * /api/midwife/appointments/{id}:
 *   put:
 *     summary: Update appointment
 *     description: Update an existing appointment by ID
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentBody'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Appointment updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/MidwifeAppointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/appointments/:id', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeAppointment = getMidwifeAppointmentModel();
  
  const appointment = await MidwifeAppointment.findOneAndUpdate(
    { _id: req.params.id, midwife: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('mom', 'firstName lastName email');

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found'
    });
  }

  res.json({
    status: 'success',
    message: 'Appointment updated successfully',
    data: appointment
  });
}));

/**
 * @swagger
 * /api/midwife/appointments/{id}:
 *   delete:
 *     summary: Delete appointment
 *     description: Delete an appointment by ID
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/appointments/:id', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeAppointment = getMidwifeAppointmentModel();
  
  const appointment = await MidwifeAppointment.findOneAndDelete({
    _id: req.params.id,
    midwife: req.user._id
  });

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found'
    });
  }

  res.json({
    status: 'success',
    message: 'Appointment deleted successfully'
  });
}));

module.exports = router;

