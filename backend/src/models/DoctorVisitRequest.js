const mongoose = require('mongoose');

const DoctorVisitRequestSchema = new mongoose.Schema({
  mom: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String for testing
    required: [true, 'Mom ID is required'],
    // For testing: can be either ObjectId or String
    // In production: should be ObjectId only
  },
  requestType: {
    type: String,
    required: [true, 'Request type is required'],
    enum: [
      'Gynecologist',
      'Pediatrician',
      'Nutritionist',
      'Mental Health',
      'Lactation Consultant',
      'Emergency'
    ]
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required'],
    enum: ['Morning', 'Afternoon', 'Evening', 'Any Time']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adminNotes: {
    type: String,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  appointmentDate: {
    type: Date,
    default: null
  },
  appointmentTime: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
DoctorVisitRequestSchema.index({ mom: 1, status: 1 });
DoctorVisitRequestSchema.index({ status: 1, preferredDate: 1 });

// Virtual for formatted date
DoctorVisitRequestSchema.virtual('formattedPreferredDate').get(function() {
  return this.preferredDate ? this.preferredDate.toLocaleDateString() : '';
});

// Virtual for request age
DoctorVisitRequestSchema.virtual('requestAge').get(function() {
  if (!this.createdAt) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('DoctorVisitRequest', DoctorVisitRequestSchema);
