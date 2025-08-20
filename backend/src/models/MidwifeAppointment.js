const mongoose = require('mongoose');

const MidwifeAppointmentSchema = new mongoose.Schema({
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
  mom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mom is required']
  },
  midwife: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Midwife is required']
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
      enum: ['in-person', 'virtual', 'home-visit', 'field-clinic'],
      default: 'in-person'
    },
    address: String,
    room: String,
    virtualLink: String,
    clinicName: String
  },
  
  // Status and type
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: [
      'Mom Weight Check',
      'Baby Weight Check', 
      'Ultrasound Scan',
      'Blood Tests',
      'Vaccinations',
      'General Checkup',
      'Antenatal Care',
      'Postnatal Care',
      'Emergency Care',
      'Consultation',
      'Follow-up',
      'Other'
    ],
    default: 'General Checkup'
  },
  
  // Medical details
  symptoms: [String],
  diagnosis: String,
  prescription: String,
  notes: String,
  midwifeNotes: String,
  
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
      default: 'LKR'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'cancelled'],
      default: 'pending'
    },
    method: String,
    transactionId: String
  },

  // Midwife-specific fields
  appointmentSource: {
    type: String,
    enum: ['direct-scheduling', 'clinic-request', 'emergency', 'follow-up'],
    default: 'direct-scheduling'
  },
  
  // Link to original clinic visit request if applicable
  clinicVisitRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClinicVisitRequest'
  },

  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Follow-up information
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String
}, {
  timestamps: true
});

// Indexes
MidwifeAppointmentSchema.index({ mom: 1, startTime: 1 });
MidwifeAppointmentSchema.index({ midwife: 1, startTime: 1 });
MidwifeAppointmentSchema.index({ status: 1 });
MidwifeAppointmentSchema.index({ startTime: 1 });
MidwifeAppointmentSchema.index({ type: 1 });
MidwifeAppointmentSchema.index({ priority: 1 });

// Virtual for appointment duration
MidwifeAppointmentSchema.virtual('durationMinutes').get(function() {
  return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

// Pre-save middleware to calculate duration
MidwifeAppointmentSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  next();
});

// Instance method to check if appointment is in the past
MidwifeAppointmentSchema.methods.isPast = function() {
  return this.startTime < new Date();
};

// Instance method to check if appointment is today
MidwifeAppointmentSchema.methods.isToday = function() {
  const today = new Date();
  const appointmentDate = new Date(this.startTime);
  return appointmentDate.toDateString() === today.toDateString();
};

// Instance method to check if appointment is upcoming
MidwifeAppointmentSchema.methods.isUpcoming = function() {
  return this.startTime > new Date() && ['scheduled', 'confirmed'].includes(this.status);
};

// Static method to get upcoming appointments for a midwife
MidwifeAppointmentSchema.statics.getUpcomingForMidwife = function(midwifeId) {
  return this.find({
    midwife: midwifeId,
    startTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ startTime: 1 }).populate('mom', 'firstName lastName email');
};

// Static method to get today's appointments for a midwife
MidwifeAppointmentSchema.statics.getTodayForMidwife = function(midwifeId) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  return this.find({
    midwife: midwifeId,
    startTime: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
  }).sort({ startTime: 1 }).populate('mom', 'firstName lastName email');
};

// Static method to get appointments by date range
MidwifeAppointmentSchema.statics.getByDateRange = function(midwifeId, startDate, endDate) {
  return this.find({
    midwife: midwifeId,
    startTime: { $gte: startDate, $lte: endDate }
  }).sort({ startTime: 1 }).populate('mom', 'firstName lastName email');
};

// Function to get the MidwifeAppointment model with the correct database connection
let MidwifeAppointment = null;

const getMidwifeAppointmentModel = () => {
  if (!MidwifeAppointment) {
    const { getConnection } = require('../config/database');
    const connection = getConnection();
    
    if (!connection) {
      throw new Error('Database connection not available');
    }
    
    MidwifeAppointment = connection.model('MidwifeAppointment', MidwifeAppointmentSchema);
  }
  return MidwifeAppointment;
};

module.exports = getMidwifeAppointmentModel;
