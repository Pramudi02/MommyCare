const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get user's appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Not authorized
 */
// Get my appointments
router.get('/', async (req, res) => {
	const query = { $or: [{ user: req.user._id }, { doctor: req.user._id }, { serviceProvider: req.user._id }] };
	const items = await Appointment.find(query).sort({ startTime: 1 });
	res.json({ status: 'success', data: items });
});

// Create appointment
router.post('/', async (req, res) => {
	const appt = await Appointment.create({ ...req.body });
	// notify via socket
	const io = req.app.get('io');
	[appt.user, appt.doctor, appt.serviceProvider].filter(Boolean).forEach((id) => {
		io.to(`user_${id}`).emit('appointment_updated', { type: 'created', appointment: appt });
	});
	res.status(201).json({ status: 'success', data: appt });
});

// Update appointment
router.put('/:id', async (req, res) => {
	const appt = await Appointment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
	if (!appt) return res.status(404).json({ status: 'error', message: 'Not found' });
	const io = req.app.get('io');
	[appt.user, appt.doctor, appt.serviceProvider].filter(Boolean).forEach((id) => {
		io.to(`user_${id}`).emit('appointment_updated', { type: 'updated', appointment: appt });
	});
	res.json({ status: 'success', data: appt });
});

// Delete appointment
router.delete('/:id', async (req, res) => {
	const appt = await Appointment.findByIdAndDelete(req.params.id);
	if (!appt) return res.status(404).json({ status: 'error', message: 'Not found' });
	const io = req.app.get('io');
	[appt.user, appt.doctor, appt.serviceProvider].filter(Boolean).forEach((id) => {
		io.to(`user_${id}`).emit('appointment_updated', { type: 'deleted', appointmentId: req.params.id });
	});
	res.json({ status: 'success', data: null });
});

module.exports = router;
