const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { authorize } = require('../middleware/auth');
const getUserModel = require('../models/User');
const getAppointmentModel = require('../models/Appointment');
const getAppointmentRequestModel = require('../models/AppointmentRequest');
const getDoctorMedicalReportModel = require('../models/DoctorMedicalReport');
const getDoctorProfileModel = require('../models/DoctorProfile');

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
router.post('/permission-request', authorize('doctor'), asyncHandler(async (req, res) => {
  // TODO: Implement permission request logic
  // For now, just return success
  res.status(201).json({
    status: 'success',
    message: 'Permission request submitted successfully'
  });
}));

// Get doctor dashboard data
router.get('/dashboard', authorize('doctor'), asyncHandler(async (req, res) => {
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
router.get('/patients', authorize('doctor'), asyncHandler(async (req, res) => {
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
router.get('/appointments', authorize('doctor'), asyncHandler(async (req, res) => {
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
router.post('/appointments', authorize('doctor'), asyncHandler(async (req, res) => {
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
router.put('/appointments/:id', authorize('doctor'), asyncHandler(async (req, res) => {
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
router.delete('/appointments/:id', authorize('doctor'), asyncHandler(async (req, res) => {
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
router.get('/appointment-requests', authorize('doctor'), asyncHandler(async (req, res) => {
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

// Get all appointments for the doctor
router.get('/appointments', authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const { patientId, status, type } = req.query;
    
    let query = { doctor: req.user._id };
    if (patientId) query.patient = patientId;
    if (status && status !== 'all') query.status = status;
    if (type) query.type = type;
    
    const appointments = await Appointment.find(query)
        .populate('patient', 'firstName lastName email')
        .sort({ startTime: -1 });
    
    res.json({ status: 'success', data: appointments });
}));

// Respond to an appointment request
router.put('/appointment-requests/:id/respond', authorize('doctor'), asyncHandler(async (req, res) => {
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

// Get doctor's patients with mom profiles and appointment counts
router.get('/my-patients', authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const getUserModel = require('../models/User');
    const getMomProfileModel = require('../models/MomProfile');
    const mongoose = require('mongoose');
    
    const User = getUserModel();
    const MomProfile = getMomProfileModel();
    
    try {
        // Get all appointments for this doctor
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'firstName lastName email _id');
        
        // Get unique patient IDs
        const patientIds = [...new Set(appointments.map(apt => apt.patient._id.toString()))];
        
        // Get mom profiles for these patients
        const momProfiles = await MomProfile.find({ 
            user: { $in: patientIds.map(id => new mongoose.Types.ObjectId(id)) }
        }).populate('user', 'firstName lastName email _id');
        
        // Get appointment counts for each patient
        const patientAppointmentCounts = {};
        appointments.forEach(apt => {
            const patientId = apt.patient._id.toString();
            patientAppointmentCounts[patientId] = (patientAppointmentCounts[patientId] || 0) + 1;
        });
        
        // Combine data
        const patients = momProfiles.map(profile => {
            const user = profile.user;
            const appointmentCount = patientAppointmentCounts[user._id.toString()] || 0;
            
            return {
                _id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: profile.phone,
                age: profile.age,
                bloodGroup: profile.bloodGroup,
                height: profile.height,
                weight: profile.weight,
                currentBMI: profile.currentBMI,
                lmp: profile.lmp,
                edd: profile.edd,
                consultantObstetrician: profile.consultantObstetrician,
                mohArea: profile.mohArea,
                phmArea: profile.phmArea,
                fieldClinic: profile.fieldClinic,
                gramaNiladhariDivision: profile.gramaNiladhariDivision,
                hospitalClinic: profile.hospitalClinic,
                nextClinicDate: profile.nextClinicDate,
                emergencyContact: profile.emergencyContact,
                medicalHistory: profile.medicalHistory,
                currentPregnancy: profile.currentPregnancy,
                appointmentCount: appointmentCount,
                lastAppointment: appointments
                    .filter(apt => apt.patient._id.toString() === user._id.toString())
                    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0]?.startTime || null,
                nextAppointment: appointments
                    .filter(apt => apt.patient._id.toString() === user._id.toString())
                    .filter(apt => new Date(apt.startTime) > new Date())
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0]?.startTime || null
            };
        });
        
        res.json({ status: 'success', data: patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch patients' });
    }
}));

// Get all available moms for doctor to assign as patients
router.get('/available-moms', authorize('doctor'), asyncHandler(async (req, res) => {
    const getUserModel = require('../models/User');
    const getMomProfileModel = require('../models/MomProfile');
    const Appointment = getAppointmentModel();
    
    const User = getUserModel();
    const MomProfile = getMomProfileModel();
    
    try {
        // Get all moms with profiles
        const momProfiles = await MomProfile.find({ isActive: true })
            .populate('user', 'firstName lastName email _id');
        
        // Get current doctor's patients
        const currentPatients = await Appointment.find({ doctor: req.user._id })
            .distinct('patient');
        
        // Filter out moms who are already patients of this doctor
        const availableMoms = momProfiles.filter(profile => 
            !currentPatients.includes(profile.user._id.toString())
        );
        
        const moms = availableMoms.map(profile => ({
            _id: profile.user._id,
            name: `${profile.user.firstName} ${profile.user.lastName}`,
            email: profile.user.email,
            phone: profile.phone,
            age: profile.age,
            bloodGroup: profile.bloodGroup,
            height: profile.height,
            weight: profile.weight,
            currentBMI: profile.currentBMI,
            lmp: profile.lmp,
            edd: profile.edd,
            consultantObstetrician: profile.consultantObstetrician,
            mohArea: profile.mohArea,
            phmArea: profile.phmArea,
            fieldClinic: profile.fieldClinic,
            gramaNiladhariDivision: profile.gramaNiladhariDivision,
            hospitalClinic: profile.hospitalClinic,
            nextClinicDate: profile.nextClinicDate,
            emergencyContact: profile.emergencyContact,
            medicalHistory: profile.medicalHistory,
            currentPregnancy: profile.currentPregnancy
        }));
        
        res.json({ status: 'success', data: moms });
    } catch (error) {
        console.error('Error fetching available moms:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch available moms' });
    }
}));

// Assign a mom as a patient to the doctor
router.post('/assign-patient', authorize('doctor'), asyncHandler(async (req, res) => {
    const { momId } = req.body;
    
    if (!momId) {
        return res.status(400).json({ status: 'error', message: 'Mom ID is required' });
    }
    
    try {
        // Create a simple appointment to establish the doctor-patient relationship
        const Appointment = getAppointmentModel();
        const getUserModel = require('../models/User');
        
        const User = getUserModel();
        const mom = await User.findById(momId);
        
        if (!mom || mom.role !== 'mom') {
            return res.status(404).json({ status: 'error', message: 'Mom not found' });
        }
        
        // Create an initial consultation appointment
        const appointment = await Appointment.create({
            title: 'Initial Consultation',
            description: 'Initial patient assignment consultation',
            patient: momId,
            doctor: req.user._id,
            startTime: new Date(),
            endTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
            duration: 30,
            type: 'consultation',
            status: 'scheduled',
            notes: 'Patient assigned to doctor'
        });
        
        res.json({ 
            status: 'success', 
            message: 'Patient assigned successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Error assigning patient:', error);
        res.status(500).json({ status: 'error', message: 'Failed to assign patient' });
    }
}));

// Get detailed patient information
router.get('/patient/:patientId', authorize('doctor'), asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const getUserModel = require('../models/User');
    const getMomProfileModel = require('../models/MomProfile');
    const Appointment = getAppointmentModel();
    
    const User = getUserModel();
    const MomProfile = getMomProfileModel();
    
    try {
        // Verify this patient belongs to the doctor
        const hasAppointment = await Appointment.findOne({ 
            doctor: req.user._id, 
            patient: patientId 
        });
        
        if (!hasAppointment) {
            return res.status(403).json({ status: 'error', message: 'Not authorized to view this patient' });
        }
        
        // Get mom profile
        const momProfile = await MomProfile.findOne({ user: patientId })
            .populate('user', 'firstName lastName email _id');
        
        if (!momProfile) {
            return res.status(404).json({ status: 'error', message: 'Patient profile not found' });
        }
        
        // Get all appointments for this patient with this doctor
        const appointments = await Appointment.find({ 
            doctor: req.user._id, 
            patient: patientId 
        }).sort({ startTime: -1 });
        
        // Get appointment statistics
        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
        const upcomingAppointments = appointments.filter(apt => 
            new Date(apt.startTime) > new Date() && apt.status === 'scheduled'
        ).length;
        
        const patientData = {
            _id: momProfile.user._id,
            name: `${momProfile.user.firstName} ${momProfile.user.lastName}`,
            email: momProfile.user.email,
            phone: momProfile.phone,
            age: momProfile.age,
            bloodGroup: momProfile.bloodGroup,
            height: momProfile.height,
            weight: momProfile.weight,
            currentBMI: momProfile.currentBMI,
            lmp: momProfile.lmp,
            edd: momProfile.edd,
            consultantObstetrician: momProfile.consultantObstetrician,
            mohArea: momProfile.mohArea,
            phmArea: momProfile.phmArea,
            fieldClinic: momProfile.fieldClinic,
            gramaNiladhariDivision: momProfile.gramaNiladhariDivision,
            hospitalClinic: momProfile.hospitalClinic,
            nextClinicDate: momProfile.nextClinicDate,
            emergencyContact: momProfile.emergencyContact,
            medicalHistory: momProfile.medicalHistory,
            currentPregnancy: momProfile.currentPregnancy,
            appointments: {
                total: totalAppointments,
                completed: completedAppointments,
                upcoming: upcomingAppointments,
                history: appointments
            }
        };
        
        res.json({ status: 'success', data: patientData });
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch patient details' });
    }
}));


// Get patients assigned to the doctor with medical report counts
router.get('/medical-records/patients', authorize('doctor'), asyncHandler(async (req, res) => {
    const Appointment = getAppointmentModel();
    const DoctorMedicalReport = getDoctorMedicalReportModel();
    const User = getUserModel();

    // Find patients by appointments with this doctor
    const appointments = await Appointment.find({ doctor: req.user._id }).populate('patient', 'firstName lastName email');
    const patientIds = [...new Set(appointments.map(a => a.patient?._id?.toString()).filter(Boolean))];

    // Count reports per patient
    const counts = await DoctorMedicalReport.aggregate([
        { $match: { doctor: req.user._id, patient: { $in: patientIds.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $group: { _id: '$patient', count: { $sum: 1 } } }
    ]);
    const idToCount = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]));

    // Build response
    const patients = await User.find({ _id: { $in: patientIds } }).select('firstName lastName email role');
    const data = patients.map(u => ({
        _id: u._id,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        role: u.role,
        reportCount: idToCount[u._id.toString()] || 0
    }));

    res.json({ status: 'success', data });
}));

// List doctor-created reports for a patient
router.get('/medical-records/:patientId', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorMedicalReport = getDoctorMedicalReportModel();
    const { patientId } = req.params;
    const reports = await DoctorMedicalReport.find({ doctor: req.user._id, patient: patientId }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: reports });
}));

// Create a medical report for a patient
router.post('/medical-records/:patientId', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorMedicalReport = getDoctorMedicalReportModel();
    const { patientId } = req.params;
    const payload = {
        patient: patientId,
        doctor: req.user._id,
        ...req.body
    };
    const created = await DoctorMedicalReport.create(payload);
    res.status(201).json({ status: 'success', data: created });
}));

// Update a doctor-created medical report
router.put('/medical-records/:reportId', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorMedicalReport = getDoctorMedicalReportModel();
    const { reportId } = req.params;
    const report = await DoctorMedicalReport.findById(reportId);
    if (!report) return res.status(404).json({ status: 'error', message: 'Report not found' });
    if (report.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to edit this report' });
    }
    Object.assign(report, req.body);
    await report.save();
    res.json({ status: 'success', data: report });
}));

// Delete a doctor-created medical report
router.delete('/medical-records/:reportId', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorMedicalReport = getDoctorMedicalReportModel();
    const { reportId } = req.params;
    const report = await DoctorMedicalReport.findById(reportId);
    if (!report) return res.status(404).json({ status: 'error', message: 'Report not found' });
    if (report.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to delete this report' });
    }
    await report.deleteOne();
    res.json({ status: 'success', message: 'Report deleted' });
}));

// Doctor Profile Routes
// Get doctor profile
router.get('/profile', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorProfile = getDoctorProfileModel();
    const User = getUserModel();
    
    try {
        // Get user data first
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        
        // Get or create profile
        let profile = await DoctorProfile.findOne({ user: req.user._id });
        
        if (!profile) {
            // Create new profile with user data
            try {
                profile = await DoctorProfile.create({
                    user: req.user._id,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    age: user.age || null,
                    hospitalInformation: {},
                    professionalInformation: {
                        specialization: user.doctorProfile?.specialization || [],
                        certifications: user.doctorProfile?.certifications || []
                    },
                    locationDetails: {
                        country: user.address?.country || ''
                    },
                    businessStats: {
                        yearsExperience: 0,
                        patientsServed: 0
                    }
                });
            } catch (createError) {
                console.error('Error creating profile:', createError);
                // If creation fails due to validation, return user data only
                const responseData = {
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    age: user.age || null,
                    hospitalInformation: {},
                    professionalInformation: {
                        specialization: user.doctorProfile?.specialization || [],
                        certifications: user.doctorProfile?.certifications || []
                    },
                    locationDetails: {
                        country: user.address?.country || ''
                    },
                    businessStats: {
                        yearsExperience: 0,
                        patientsServed: 0
                    }
                };
                return res.json({ status: 'success', data: responseData });
            }
        }
        
        // Return combined data: profile data + user data
        const responseData = {
            ...profile.toObject(),
            // Override with user data for personal information
            firstName: user.firstName || profile.firstName,
            lastName: user.lastName || profile.lastName,
            email: user.email || profile.email,
            phone: user.phone || profile.phone,
            age: user.age || profile.age
        };
        
        res.json({ status: 'success', data: responseData });
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch profile' });
    }
}));

// Create or update doctor profile
router.post('/profile', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorProfile = getDoctorProfileModel();
    const User = getUserModel();
    
    try {
        const existingProfile = await DoctorProfile.findOne({ user: req.user._id });
        
        let profile;
        if (existingProfile) {
            // Update existing profile
            try {
                Object.assign(existingProfile, req.body);
                await existingProfile.save();
                profile = existingProfile;
            } catch (saveError) {
                console.error('Error saving existing profile:', saveError);
                return res.status(400).json({ status: 'error', message: 'Invalid profile data' });
            }
        } else {
            // Create new profile
            try {
                const profileData = {
                    user: req.user._id,
                    ...req.body
                };
                profile = await DoctorProfile.create(profileData);
            } catch (createError) {
                console.error('Error creating new profile:', createError);
                return res.status(400).json({ status: 'error', message: 'Invalid profile data' });
            }
        }
        
        // Get updated user data
        const user = await User.findById(req.user._id);
        
        // Return combined data: profile data + user data
        const responseData = {
            ...profile.toObject(),
            // Override with user data for personal information
            firstName: user.firstName || profile.firstName,
            lastName: user.lastName || profile.lastName,
            email: user.email || profile.email,
            phone: user.phone || profile.phone,
            age: user.age || profile.age
        };
        
        res.status(201).json({ status: 'success', data: responseData });
    } catch (error) {
        console.error('Error saving doctor profile:', error);
        res.status(500).json({ status: 'error', message: 'Failed to save profile' });
    }
}));

// Update doctor profile
router.put('/profile', authorize('doctor'), asyncHandler(async (req, res) => {
    const DoctorProfile = getDoctorProfileModel();
    const User = getUserModel();
    
    try {
        const profile = await DoctorProfile.findOne({ user: req.user._id });
        
        if (!profile) {
            return res.status(404).json({ status: 'error', message: 'Profile not found' });
        }
        
        try {
            Object.assign(profile, req.body);
            await profile.save();
        } catch (saveError) {
            console.error('Error updating profile:', saveError);
            return res.status(400).json({ status: 'error', message: 'Invalid profile data' });
        }
        
        // Get updated user data
        const user = await User.findById(req.user._id);
        
        // Return combined data: profile data + user data
        const responseData = {
            ...profile.toObject(),
            // Override with user data for personal information
            firstName: user.firstName || profile.firstName,
            lastName: user.lastName || profile.lastName,
            email: user.email || profile.email,
            phone: user.phone || profile.phone,
            age: user.age || profile.age
        };
        
        res.json({ status: 'success', data: responseData });
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update profile' });
    }
}));

module.exports = router;
