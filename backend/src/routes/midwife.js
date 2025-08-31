const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const getClinicVisitRequestModel = require('../models/ClinicVisitRequest');
const getMidwifeAppointmentModel = require('../models/MidwifeAppointment');
const getMomProfileModel = require('../models/MomProfile');
const getMedicalRecordModel = require('../models/MedicalRecord');
const getMidwifeMomModel = require('../models/MidwifeMom');
const { getMidwifeProfileModel } = require('../models/MidwifeProfile');
const getUserModel = require('../models/User');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MidwifeProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the profile
 *         user:
 *           type: string
 *           description: Reference to the User model
 *         firstName:
 *           type: string
 *           description: Midwife's first name
 *         lastName:
 *           type: string
 *           description: Midwife's last name
 *         email:
 *           type: string
 *           description: Midwife's email address
 *         phone:
 *           type: string
 *           description: Midwife's phone number
 *         address:
 *           type: string
 *           description: Midwife's address
 *         licenseNumber:
 *           type: string
 *           description: Midwife's license number
 *         experience:
 *           type: string
 *           description: Years of experience
 *         phmArea:
 *           type: string
 *           description: PHM area assignment
 *         mohArea:
 *           type: string
 *           description: MOH office assignment
 *         certifications:
 *           type: string
 *           description: Professional certifications
 *         updatedBy:
 *           type: string
 *           description: Reference to user who last updated the profile
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
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
  
  console.log('🕐 Backend received appointment data:', {
    appointmentDate,
    startTime,
    endTime,
    notes,
    location
  });
  
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

  // Create appointment date and time in local timezone
  const [year, month, day] = appointmentDate.split('-').map(Number);
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Create dates in local timezone to avoid UTC conversion issues
  const appointmentDateTime = new Date(year, month - 1, day, startHours, startMinutes, 0, 0);
  const endDateTime = new Date(year, month - 1, day, endHours, endMinutes, 0, 0);
  
  // Convert to UTC to ensure consistent storage
  const appointmentDateTimeUTC = new Date(appointmentDateTime.getTime() - (appointmentDateTime.getTimezoneOffset() * 60000));
  const endDateTimeUTC = new Date(endDateTime.getTime() - (endDateTime.getTimezoneOffset() * 60000));
  
  console.log('🕐 Backend created appointment times:', {
    originalStartTime: startTime,
    originalEndTime: endTime,
    appointmentDateTimeLocal: appointmentDateTime.toString(),
    endDateTimeLocal: endDateTime.toString(),
    appointmentDateTimeUTC: appointmentDateTimeUTC.toISOString(),
    endDateTimeUTC: endDateTimeUTC.toISOString(),
    timezoneOffset: appointmentDateTime.getTimezoneOffset()
  });

  // Create the appointment
  const appointment = await MidwifeAppointment.create({
    title: `${request.requestType} - ${request.mom.firstName || 'Mom'}`,
    description: request.notes || `Appointment for ${request.requestType}`,
    mom: request.mom,
    midwife: req.user._id,
    startTime: appointmentDateTimeUTC,
    endTime: endDateTimeUTC,
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
      let weekStart, weekEnd;
      
      if (startDate && endDate) {
        // Use provided start and end dates
        weekStart = new Date(startDate);
        weekStart.setHours(0, 0, 0, 0);
        weekEnd = new Date(endDate);
        weekEnd.setHours(23, 59, 59, 999);
      } else {
        // Calculate week start (Monday) and end (Sunday) based on current date
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Calculate days to subtract to get to Monday (1)
        const mondayOffset = currentDay === 0 ? -6 : -(currentDay - 1);
        
        weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() + mondayOffset);
        weekStart.setHours(0, 0, 0, 0); // Start of day
        
        weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999); // End of day
      }
      
      appointments = await MidwifeAppointment.getByDateRange(req.user._id, weekStart, weekEnd);
      break;
    case 'month':
      let monthStart, monthEnd;
      
      if (startDate && endDate) {
        // Use provided start and end dates
        monthStart = new Date(startDate);
        monthStart.setHours(0, 0, 0, 0);
        monthEnd = new Date(endDate);
        monthEnd.setHours(23, 59, 59, 999);
      } else {
        // Calculate current month
        monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0); // Start of day
        monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999); // End of day
      }
      
      appointments = await MidwifeAppointment.getByDateRange(req.user._id, monthStart, monthEnd);
      break;
    case 'all':
    default:
      appointments = await MidwifeAppointment.find({ midwife: req.user._id })
        .sort({ startTime: 1 })
        .populate('mom', 'firstName lastName email');
      
      console.log('🕐 Backend returning appointments:', appointments.length, 'appointments');
      appointments.forEach(apt => {
        console.log('🕐 Appointment:', {
          id: apt._id,
          startTime: apt.startTime,
          endTime: apt.endTime,
          startTimeLocal: new Date(apt.startTime).toString(),
          endTimeLocal: new Date(apt.endTime).toString(),
          mom: apt.mom?.firstName
        });
      });
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

// ===== MIDWIFE-MOM ASSIGNMENT =====

/**
 * @swagger
 * /api/midwife/moms:
 *   get:
 *     summary: Get moms assigned to the authenticated midwife
 *     description: Returns mom profiles assigned to the midwife through MidwifeMom collection.
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by name or phone (case-insensitive)
 *     responses:
 *       200:
 *         description: Moms retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/moms', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeMom = getMidwifeMomModel();
  const MomProfile = getMomProfileModel();
  const { q } = req.query;

  // Get mom IDs assigned to this midwife
  const assignments = await MidwifeMom.find({ 
    midwife: req.user._id, 
    status: 'active' 
  }).select('mom');

  const momIds = assignments.map(a => a.mom);

  if (momIds.length === 0) {
    return res.json({ status: 'success', data: [] });
  }

  // Build query for mom profiles
  const filter = { _id: { $in: momIds } };
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [
      { name: regex },
      { phone: regex }
    ];
  }

  const moms = await MomProfile.find(filter)
    .sort({ name: 1 })
    .select('-__v');

  res.json({ status: 'success', data: moms });
}));

/**
 * @swagger
 * /api/midwife/moms/search:
 *   get:
 *     summary: Search for moms to assign to midwife
 *     description: Search all mom profiles to find moms that can be assigned to the midwife.
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for mom name or phone
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Not authorized
 */
router.get('/moms/search', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const User = getUserModel();
  const MomProfile = getMomProfileModel();
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Search query must be at least 2 characters' 
    });
  }

  try {
    // Search for all users with role 'mom'
    const regex = new RegExp(q.trim(), 'i');
    
    // First, search in User collection for moms
    const momUsers = await User.find({
      role: 'mom',
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex }
      ]
    }).select('firstName lastName email role');

    if (momUsers.length === 0) {
      return res.json({ status: 'success', data: [] });
    }

    // Get mom profile details for these users
    const momUserIds = momUsers.map(user => user._id);
    const momProfiles = await MomProfile.find({
      user: { $in: momUserIds }
    }).select('name phone age phmArea user');

    // Create a map of user ID to profile data
    const profileMap = {};
    momProfiles.forEach(profile => {
      profileMap[profile.user.toString()] = profile;
    });

    // Combine user and profile data
    const results = momUsers.map(user => {
      const profile = profileMap[user._id.toString()];
      return {
        _id: user._id, // This is the User ID for assignment
        name: profile ? profile.name : `${user.firstName} ${user.lastName}`,
        phone: profile ? profile.phone : 'Not set',
        age: profile ? profile.age : 'Not set',
        phmArea: profile ? profile.phmArea : 'Not set',
        email: user.email
      };
    });

    // Sort by name and limit results
    results.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({ 
      status: 'success', 
      data: results.slice(0, 20) // Increased limit to show more results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Search failed' 
    });
  }
}));

/**
 * @swagger
 * /api/midwife/moms/assign:
 *   post:
 *     summary: Assign a mom to the midwife
 *     description: Create a MidwifeMom assignment to connect a mom to the midwife.
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - momId
 *             properties:
 *               momId:
 *                 type: string
 *                 description: Mom profile ID to assign
 *               notes:
 *                 type: string
 *                 description: Optional notes about the assignment
 *     responses:
 *       200:
 *         description: Mom assigned successfully
 *       400:
 *         description: Invalid request or mom already assigned
 *       401:
 *         description: Not authorized
 */
router.post('/moms/assign', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeMom = getMidwifeMomModel();
  const MomProfile = getMomProfileModel();
  const User = getUserModel();
  const { momId, notes } = req.body;

  if (!momId) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Mom ID is required' 
    });
  }

  try {
    // First check if momId is a User ID
    let user = await User.findById(momId);
    let momProfile = null;
    
    if (user && user.role === 'mom') {
      // Check if mom profile exists
      momProfile = await MomProfile.findOne({ user: momId });
      
      if (!momProfile) {
        // Create a basic mom profile if it doesn't exist
        // Use valid default values for required fields
        const defaultProfileData = {
          user: momId,
          name: `${user.firstName} ${user.lastName}`,
          phone: '0000000000', // Valid phone format
          age: 25, // Valid age
          bloodGroup: 'O+', // Valid blood group
          height: { value: 160, unit: 'cm' }, // Valid height
          weight: { value: 60, unit: 'kg' }, // Valid weight
          currentBMI: 23.4, // Valid BMI
          lmp: new Date(), // Current date
          edd: new Date(Date.now() + 280 * 24 * 60 * 60 * 1000), // 40 weeks from now
          consultantObstetrician: 'To be assigned', // Valid string
          mohArea: 'To be assigned', // Valid string
          phmArea: 'To be assigned', // Valid string
          fieldClinic: 'To be assigned', // Valid string
          gramaNiladhariDivision: 'To be assigned', // Valid string
          hospitalClinic: 'To be assigned', // Valid string
          nextClinicDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          profileCompleted: false
        };
        
        try {
          momProfile = await MomProfile.create(defaultProfileData);
          console.log('Created new mom profile for user:', momId);
        } catch (profileError) {
          console.error('Error creating mom profile:', profileError);
          return res.status(500).json({
            status: 'error',
            message: 'Failed to create mom profile: ' + profileError.message
          });
        }
      }
    } else {
      // Check if momId is a MomProfile ID
      momProfile = await MomProfile.findById(momId);
      if (momProfile) {
        user = await User.findById(momProfile.user);
      }
    }

    if (!momProfile || !user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Mom not found' 
      });
    }

    // Check if already assigned
    const existingAssignment = await MidwifeMom.findOne({
      midwife: req.user._id,
      mom: momProfile._id,
      status: 'active'
    });

    if (existingAssignment) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Mom is already assigned to this midwife' 
      });
    }

    // Create assignment
    const assignment = await MidwifeMom.create({
      midwife: req.user._id,
      mom: momProfile._id,
      assignedBy: req.user._id,
      notes
    });

    res.json({ 
      status: 'success', 
      message: 'Mom assigned successfully',
      data: assignment 
    });

  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to assign mom: ' + error.message
    });
  }
}));

// ===== MEDICAL RECORDS MANAGEMENT =====

/**
 * @swagger
 * /api/midwife/moms/:id/records:
 *   get:
 *     summary: Get combined medical records for a mom
 *     description: Returns mom profile data combined with medical record data.
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mom profile ID
 *     responses:
 *       200:
 *         description: Medical records retrieved successfully
 *       404:
 *         description: Mom not found
 */
router.get('/moms/:id/records', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeMom = getMidwifeMomModel();
  const MomProfile = getMomProfileModel();
  const MedicalRecord = getMedicalRecordModel();

  // Verify midwife has access to this mom
  const assignment = await MidwifeMom.findOne({
    midwife: req.user._id,
    mom: req.params.id,
    status: 'active'
  });

  if (!assignment) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Access denied: Mom not assigned to this midwife' 
    });
  }

  const mom = await MomProfile.findById(req.params.id);
  if (!mom) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Mom not found' 
    });
  }

  const record = await MedicalRecord.findOne({ mom: mom._id });
  
  res.json({ 
    status: 'success', 
    data: { mom, record: record || {} } 
  });
}));

/**
 * @swagger
 * /api/midwife/moms/:id/overview:
 *   patch:
 *     summary: Update mom overview data
 *     description: Update overview fields in MomProfile (editable by midwife).
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mom profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *               bloodGroup:
 *                 type: string
 *               height:
 *                 type: object
 *               weight:
 *                 type: object
 *               currentBMI:
 *                 type: number
 *               mohArea:
 *                 type: string
 *               phmArea:
 *                 type: string
 *               fieldClinic:
 *                 type: string
 *               gramaNiladhariDivision:
 *                 type: string
 *               hospitalClinic:
 *                 type: string
 *               consultantObstetrician:
 *                 type: string
 *               nextClinicDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Overview updated successfully
 *       404:
 *         description: Mom not found
 */
router.patch('/moms/:id/overview', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeMom = getMidwifeMomModel();
  const MomProfile = getMomProfileModel();

  // Verify midwife has access to this mom
  const assignment = await MidwifeMom.findOne({
    midwife: req.user._id,
    mom: req.params.id,
    status: 'active'
  });

  if (!assignment) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Access denied: Mom not assigned to this midwife' 
    });
  }

  const allowedFields = [
    'name', 'phone', 'age', 'bloodGroup', 'height', 'weight', 'currentBMI',
    'mohArea', 'phmArea', 'fieldClinic', 'gramaNiladhariDivision',
    'hospitalClinic', 'consultantObstetrician', 'nextClinicDate'
  ];

  const payload = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      payload[field] = req.body[field];
    }
  }

  // Handle date conversion
  if (payload.nextClinicDate) {
    payload.nextClinicDate = new Date(payload.nextClinicDate);
  }

  // Handle numeric conversions for height/weight
  if (payload.height && payload.height.value) {
    payload.height.value = Number(payload.height.value);
  }
  if (payload.weight && payload.weight.value) {
    payload.weight.value = Number(payload.weight.value);
  }

  const updated = await MomProfile.findByIdAndUpdate(
    req.params.id, 
    payload, 
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({ 
      status: 'error', 
      message: 'Mom not found' 
    });
  }

  res.json({ 
    status: 'success', 
    message: 'Overview updated successfully', 
    data: updated 
  });
}));

/**
 * @swagger
 * /api/midwife/moms/:id/prepregnancy:
 *   patch:
 *     summary: Update pre-pregnancy data
 *     description: Update pre-pregnancy fields in MedicalRecord collection.
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mom profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lmp:
 *                 type: string
 *                 format: date
 *               quickening:
 *                 type: string
 *                 format: date
 *               amenorrheaAtRegistration:
 *                 type: string
 *               consanguinity:
 *                 type: boolean
 *               rubellaImmunization:
 *                 type: boolean
 *               prePregnancyScreening:
 *                 type: boolean
 *               preconceptionalFolicAcid:
 *                 type: boolean
 *               historyOfSubfertility:
 *                 type: boolean
 *               planningPregnancy:
 *                 type: boolean
 *               familyPlanningLastUsed:
 *                 type: string
 *               ageOfYoungestChild:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pre-pregnancy data saved successfully
 */
router.patch('/moms/:id/prepregnancy', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  const MidwifeMom = getMidwifeMomModel();
  const MedicalRecord = getMedicalRecordModel();

  // Verify midwife has access to this mom
  const assignment = await MidwifeMom.findOne({
    midwife: req.user._id,
    mom: req.params.id,
    status: 'active'
  });

  if (!assignment) {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Access denied: Mom not assigned to this midwife' 
    });
  }

  const momId = req.params.id;
  const set = {};
  const allowedFields = [
    'lmp', 'quickening', 'amenorrheaAtRegistration', 'consanguinity',
    'rubellaImmunization', 'prePregnancyScreening', 'preconceptionalFolicAcid',
    'historyOfSubfertility', 'planningPregnancy', 'familyPlanningLastUsed',
    'ageOfYoungestChild'
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      set[`prePregnancy.${field}`] = req.body[field];
    }
  }

  // Handle date conversions
  if (set['prePregnancy.lmp']) {
    set['prePregnancy.lmp'] = new Date(set['prePregnancy.lmp']);
  }
  if (set['prePregnancy.quickening']) {
    set['prePregnancy.quickening'] = new Date(set['prePregnancy.quickening']);
  }

  const updated = await MedicalRecord.findOneAndUpdate(
    { mom: momId },
    { $set: set, updatedBy: req.user._id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ 
    status: 'success', 
    message: 'Pre-pregnancy data saved successfully', 
    data: updated 
  });
}));

/**
 * @swagger
 * /api/midwife/profile:
 *   get:
 *     summary: Get midwife profile
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Midwife profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MidwifeProfile'
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get('/profile', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  try {
    console.log('🔍 Midwife profile request - User ID:', req.user._id);
    console.log('🔍 User data from JWT:', {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role
    });
    
    // Try to get the existing midwife profile from database
    try {
      const MidwifeProfile = getMidwifeProfileModel();
      let profile = await MidwifeProfile.findOne({ user: req.user._id });
      
      if (profile) {
        console.log('✅ Found existing midwife profile:', profile);
        res.json({ status: 'success', data: profile });
      } else {
        console.log('📝 No profile found, creating new one...');
        // Create new profile with user data from JWT token
        profile = await MidwifeProfile.create({
          user: req.user._id,
          firstName: req.user.firstName || '',
          lastName: req.user.lastName || '',
          email: req.user.email || '',
          phone: '',
          licenseNumber: '',
          experience: '',
          phmArea: '',
          mohArea: '',
          certifications: '',
          address: ''
        });
        console.log('✅ Created new midwife profile:', profile);
        res.json({ status: 'success', data: profile });
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      // Fallback to simple profile if database fails
      const simpleProfile = {
        user: req.user._id,
        firstName: req.user.firstName || '',
        lastName: req.user.lastName || '',
        email: req.user.email || '',
        phone: '',
        licenseNumber: '',
        experience: '',
        phmArea: '',
        mohArea: '',
        certifications: '',
        address: ''
      };
      console.log('✅ Using fallback profile:', simpleProfile);
      res.json({ status: 'success', data: simpleProfile });
    }
    
  } catch (error) {
    console.error('❌ Error in midwife profile route:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      error: error.message 
    });
  }
}));

/**
 * @swagger
 * /api/midwife/profile:
 *   patch:
 *     summary: Update midwife profile
 *     tags: [Midwife]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               experience:
 *                 type: string
 *               phmArea:
 *                 type: string
 *               mohArea:
 *                 type: string
 *               certifications:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MidwifeProfile'
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.patch('/profile', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  try {
    console.log('🔧 Updating midwife profile for user:', req.user._id);
    console.log('🔧 Update data received:', req.body);
    console.log('🔧 Request headers:', req.headers);
    
    // Update the midwife profile in database
    let MidwifeProfile;
    try {
      MidwifeProfile = getMidwifeProfileModel();
      console.log('✅ MidwifeProfile model loaded successfully');
    } catch (modelError) {
      console.error('❌ Error loading MidwifeProfile model:', modelError);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to load database model',
        error: modelError.message 
      });
    }
    
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'address',
      'licenseNumber', 'experience', 'phmArea', 'mohArea', 'certifications'
    ];
    
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    updateData.updatedBy = req.user._id;
    updateData.lastUpdated = new Date();
    
    console.log('🔧 Final update data:', updateData);
    console.log('🔧 User ID for update:', req.user._id);
    
    // Update the midwife profile
    const profile = await MidwifeProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    
    console.log('✅ Profile updated successfully in database:', profile);
    
    res.json({ 
      status: 'success', 
      message: 'Profile updated successfully', 
      data: profile 
    });
  } catch (error) {
    console.error('❌ Error updating midwife profile:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      error: error.message 
    });
  }
}));

// Test endpoint to check if MidwifeProfile model is working
router.get('/test-profile-model', protect, authorize('midwife'), asyncHandler(async (req, res) => {
  try {
    console.log('🧪 Testing MidwifeProfile model...');
    const MidwifeProfile = getMidwifeProfileModel();
    console.log('✅ Model loaded successfully');
    
    // Try to find a profile
    const profile = await MidwifeProfile.findOne({ user: req.user._id });
    console.log('🔍 Profile search result:', profile ? 'Found' : 'Not found');
    
    res.json({ 
      status: 'success', 
      message: 'MidwifeProfile model is working',
      profileExists: !!profile,
      userId: req.user._id
    });
  } catch (error) {
    console.error('❌ Test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Test failed',
      error: error.message 
    });
  }
}));

module.exports = router;

