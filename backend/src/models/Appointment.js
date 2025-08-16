const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Basic appointment info
  title: {
    type: String,
    required: [true, 'Appointment title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  // Participants
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
  
  // Scheduling
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['in-person', 'virtual', 'home-visit'],
      default: 'in-person'
    },
    address: String,
    room: String,
    virtualLink: String
  },
  
  // Status and type
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['consultation', 'checkup', 'emergency', 'follow-up', 'procedure', 'other'],
    default: 'consultation'
  },
  
  // Medical details
  symptoms: [String],
  diagnosis: String,
  prescription: String,
  notes: String,
  
  // Reminders
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    time: {
      type: Date,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  
  // Cancellation
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  cancelledAt: Date,
  
  // Payment
  payment: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'cancelled'],
      default: 'pending'
    },
    method: String,
    transactionId: String
  }
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ patient: 1, startTime: 1 });
appointmentSchema.index({ doctor: 1, startTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ startTime: 1 });

// Virtual for appointment duration
appointmentSchema.virtual('durationMinutes').get(function() {
  return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

// Pre-save middleware to calculate duration
appointmentSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  next();
});

// Instance method to check if appointment is in the past
appointmentSchema.methods.isPast = function() {
  return this.startTime < new Date();
};

// Instance method to check if appointment is today
appointmentSchema.methods.isToday = function() {
  const today = new Date();
  const appointmentDate = new Date(this.startTime);
  return appointmentDate.toDateString() === today.toDateString();
};

// Static method to get upcoming appointments
appointmentSchema.statics.getUpcoming = function(userId, role = 'patient') {
  const query = role === 'doctor' ? { doctor: userId } : { patient: userId };
  return this.find({
    ...query,
    startTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ startTime: 1 });
};

// Function to get the Appointment model with the correct database connection
let Appointment = null;

const getAppointmentModel = () => {
  if (!Appointment) {
    const { getMommyCareDataConnection } = require('../config/database');
    const mommyCareDataConnection = getMommyCareDataConnection();
    
    if (!mommyCareDataConnection) {
      throw new Error('MommyCareData database connection not available');
    }
    
    Appointment = mommyCareDataConnection.model('Appointment', appointmentSchema);
  }
  return Appointment;
};

module.exports = getAppointmentModel;
