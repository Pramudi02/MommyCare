const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
	reason: { type: String },
	notes: { type: String },
	location: { type: String, default: 'online' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
