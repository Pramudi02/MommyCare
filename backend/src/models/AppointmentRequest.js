const mongoose = require('mongoose');

const appointmentRequestSchema = new mongoose.Schema({
  // Request details
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required']
  },
  
  // Requested appointment details
  requestedDate: {
    type: Date,
    required: [true, 'Requested date is required']
  },
  requestedTime: {
    type: String,
    required: [true, 'Requested time is required']
  },
  preferredDuration: {
    type: Number,
    default: 30,
    min: 15,
    max: 120
  },
  
  // Appointment details
  type: {
    type: String,
    enum: ['consultation', 'checkup', 'follow-up', 'emergency', 'procedure', 'other'],
    default: 'consultation'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  urgency: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Status and processing
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'rescheduled'],
    default: 'pending'
  },
  
  // Doctor's response
  doctorResponse: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'rescheduled'],
      default: 'pending'
    },
    responseDate: Date,
    notes: String,
    suggestedDate: Date,
    suggestedTime: String
  },
  
  // If approved, create actual appointment
  createdAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  // Additional information
  patientNotes: String,
  doctorNotes: String,
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
appointmentRequestSchema.index({ patient: 1, status: 1 });
appointmentRequestSchema.index({ doctor: 1, status: 1 });
appointmentRequestSchema.index({ status: 1, requestedDate: 1 });
appointmentRequestSchema.index({ createdAt: 1 });

// Virtual for request age
appointmentRequestSchema.virtual('requestAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Instance method to check if request is urgent
appointmentRequestSchema.methods.isUrgent = function() {
  return this.urgency === 'urgent' || this.urgency === 'high';
};

// Instance method to check if request is overdue
appointmentRequestSchema.methods.isOverdue = function() {
  const now = new Date();
  const requestDate = new Date(this.requestedDate);
  return requestDate < now && this.status === 'pending';
};

// Static method to get pending requests for a doctor
appointmentRequestSchema.statics.getPendingForDoctor = function(doctorId) {
  return this.find({
    doctor: doctorId,
    status: 'pending'
  }).populate('patient', 'firstName lastName email')
    .sort({ requestedDate: 1, createdAt: 1 });
};

// Static method to get requests by status
appointmentRequestSchema.statics.getByStatus = function(doctorId, status) {
  return this.find({
    doctor: doctorId,
    status: status
  }).populate('patient', 'firstName lastName email')
    .sort({ requestedDate: 1, createdAt: 1 });
};

// Function to get the AppointmentRequest model with the correct database connection
let AppointmentRequest = null;

const getAppointmentRequestModel = () => {
  if (!AppointmentRequest) {
    const { getConnection } = require('../config/database');
    const conn = getConnection();
    
    if (!conn) {
      throw new Error('Database connection not available');
    }
    
    AppointmentRequest = conn.model('AppointmentRequest', appointmentRequestSchema);
  }
  return AppointmentRequest;
};

module.exports = getAppointmentRequestModel;
