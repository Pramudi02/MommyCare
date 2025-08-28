const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const getUserModel = require('../models/User');
const getAppointmentModel = require('../models/Appointment');
const getAppointmentRequestModel = require('../models/AppointmentRequest');

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

// Get doctor dashboard data
router.get('/dashboard', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const upcoming = await Appointment.find({
        doctor: req.user._id,
        startTime: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
    })
    .sort({ startTime: 1 })
    .limit(5)
    .populate('patient', 'firstName lastName');

    res.json({
        status: 'success',
        data: {
            doctor: req.user,
            upcomingAppointments: upcoming
        }
    });
}));

// Get patients (moms) with search
router.get('/patients', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const User = getUserModel();
    const { q } = req.query;
    
    let query = { role: 'mom' };
    if (q) {
        query.$or = [
            { firstName: { $regex: q, $options: 'i' } },
            { lastName: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
        ];
    }
    
    const patients = await User.find(query)
        .select('firstName lastName email _id')
        .limit(50);
    
    res.json({ status: 'success', data: patients });
}));

// Get doctor's appointments
router.get('/appointments', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const { start, end } = req.query;
    
    let query = { doctor: req.user._id };
    if (start && end) {
        query.startTime = {
            $gte: new Date(start),
            $lte: new Date(end)
        };
    }
    
    const appointments = await Appointment.find(query)
        .populate('patient', 'firstName lastName email')
        .sort({ startTime: 1 });
    
    res.json({ status: 'success', data: appointments });
}));

// Create a new appointment for the current doctor
router.post('/appointments', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const {
        patientId,
        title,
        description,
        startTime,
        endTime,
        duration,
        type,
        status,
        location,
        notes
    } = req.body;

    if (!patientId || !startTime || (!endTime && !duration)) {
        return res.status(400).json({ status: 'error', message: 'patientId, startTime and endTime or duration are required' });
    }

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date(start.getTime() + (Number(duration || 30) * 60000));

    const appt = await Appointment.create({
        title: title || 'Appointment',
        description: description || '',
        patient: patientId,
        doctor: req.user._id,
        startTime: start,
        endTime: end,
        duration: duration || Math.round((end.getTime() - start.getTime()) / 60000),
        type: type || 'consultation',
        status: status || 'scheduled',
        location: location || { type: 'in-person' },
        notes: notes || ''
    });

    const populated = await Appointment.findById(appt._id)
        .populate('patient', 'firstName lastName email')
        .populate('doctor', 'firstName lastName email');

    // Realtime notify participants if socket.io available
    try {
        const io = req.app.get('io');
        if (io) {
            [populated.patient?._id, populated.doctor?._id].filter(Boolean).forEach((id) => {
                io.to(`user_${id}`).emit('appointment_updated', { type: 'created', appointment: populated });
            });
        }
    } catch (e) {}

    res.status(201).json({ status: 'success', data: populated });
}));

// Update an appointment
router.put('/appointments/:id', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
        return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }
    
    // Check if the appointment belongs to the current doctor
    if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to update this appointment' });
    }
    
    const {
        title,
        description,
        startTime,
        endTime,
        duration,
        type,
        status,
        location,
        notes
    } = req.body;
    
    // Update appointment fields
    if (title !== undefined) appointment.title = title;
    if (description !== undefined) appointment.description = description;
    if (startTime !== undefined) appointment.startTime = new Date(startTime);
    if (endTime !== undefined) appointment.endTime = new Date(endTime);
    if (duration !== undefined) appointment.duration = duration;
    if (type !== undefined) appointment.type = type;
    if (status !== undefined) appointment.status = status;
    if (location !== undefined) appointment.location = location;
    if (notes !== undefined) appointment.notes = notes;
    
    // Recalculate endTime if duration changed
    if (duration && !endTime) {
        appointment.endTime = new Date(appointment.startTime.getTime() + (duration * 60000));
    }
    
    await appointment.save();
    
    // Populate and return updated appointment
    const updated = await Appointment.findById(appointment._id)
        .populate('patient', 'firstName lastName email')
        .populate('doctor', 'firstName lastName email');
    
    // Realtime notify participants if socket.io available
    try {
        const io = req.app.get('io');
        if (io) {
            [updated.patient?._id, updated.doctor?._id].filter(Boolean).forEach((id) => {
                io.to(`user_${id}`).emit('appointment_updated', { type: 'updated', appointment: updated });
            });
        }
    } catch (e) {}
    
    res.json({ status: 'success', data: updated });
}));

// Delete an appointment
router.delete('/appointments/:id', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
        return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }
    
    // Check if the appointment belongs to the current doctor
    if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to delete this appointment' });
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    
    // Realtime notify participants if socket.io available
    try {
        const io = req.app.get('io');
        if (io) {
            [appointment.patient, appointment.doctor].filter(Boolean).forEach((id) => {
                io.to(`user_${id}`).emit('appointment_updated', { type: 'deleted', appointmentId: req.params.id });
            });
        }
    } catch (e) {}
    
    res.json({ status: 'success', message: 'Appointment deleted successfully' });
}));

// Get appointment requests for the doctor
router.get('/appointment-requests', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const AppointmentRequest = getAppointmentRequestModel();
    const { status } = req.query;
    
    let query = { doctor: req.user._id };
    if (status && status !== 'all') {
        query.status = status;
    }
    
    const requests = await AppointmentRequest.find(query)
        .populate('patient', 'firstName lastName email')
        .sort({ createdAt: -1 });
    
    res.json({ status: 'success', data: requests });
}));

// Respond to an appointment request
router.put('/appointment-requests/:id/respond', protect, authorize('doctor'), asyncHandler(async (req, res) => {
    const AppointmentRequest = getAppointmentRequestModel();
    const Appointment = getAppointmentModel();
    const { response, notes, suggestedDate, suggestedTime } = req.body;
    
    if (!['approved', 'rejected', 'rescheduled'].includes(response)) {
        return res.status(400).json({ status: 'error', message: 'Invalid response. Must be approved, rejected, or rescheduled' });
    }
    
    const request = await AppointmentRequest.findById(req.params.id);
    if (!request) {
        return res.status(404).json({ status: 'error', message: 'Appointment request not found' });
    }
    
    if (request.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to respond to this request' });
    }
    
    // Update request status
    request.status = response;
    request.doctorResponse = {
        status: response,
        responseDate: new Date(),
        notes: notes || '',
        suggestedDate: suggestedDate ? new Date(suggestedDate) : undefined,
        suggestedTime: suggestedTime || ''
    };
    
    // If approved, create actual appointment
    if (response === 'approved') {
        const startTime = new Date(request.requestedDate);
        const [hours, minutes] = request.requestedTime.split(':');
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endTime = new Date(startTime.getTime() + (request.preferredDuration * 60000));
        
        const appointment = await Appointment.create({
            title: `${request.type} - ${request.reason}`,
            description: request.reason,
            patient: request.patient,
            doctor: req.user._id,
            startTime: startTime,
            endTime: endTime,
            duration: request.preferredDuration,
            type: request.type,
            status: 'scheduled',
            notes: request.patientNotes || ''
        });
        
        request.createdAppointment = appointment._id;
    }
    
    await request.save();
    
    res.json({ status: 'success', data: request });
}));

module.exports = router;
