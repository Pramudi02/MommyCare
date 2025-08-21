const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  // Baby/Child information
  baby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Baby/Child ID is required']
  },
  
  // Vaccination details
  vaccine: {
    type: String,
    required: [true, 'Vaccine name is required']
  },
  
  // Age when vaccine should be given
  recommendedAge: {
    type: String,
    required: [true, 'Recommended age is required']
  },
  
  // Due date for the vaccine
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  
  // Status of the vaccination
  status: {
    type: String,
    enum: ['upcoming', 'due', 'completed', 'missed', 'overdue'],
    default: 'upcoming'
  },
  
  // Vaccination date (when actually given)
  vaccinationDate: {
    type: Date,
    default: null
  },
  
  // Batch number (for completed vaccinations)
  batchNo: {
    type: String,
    default: null
  },
  
  // Adverse effects
  adverseEffects: {
    type: String,
    default: null
  },
  
  // BCG scar information (specific to BCG vaccine)
  bcgScar: {
    type: Boolean,
    default: null
  },
  
  // Last given date (for tracking)
  lastGiven: {
    type: String,
    default: 'Not given yet'
  },
  
  // Recommendation notes
  recommendation: {
    type: String,
    default: null
  },
  
  // Associated clinic visit request (if created)
  clinicVisitRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClinicVisitRequest',
    default: null
  },
  
  // Notes
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
vaccinationRecordSchema.index({ baby: 1, status: 1 });
vaccinationRecordSchema.index({ status: 1, dueDate: 1 });
vaccinationRecordSchema.index({ baby: 1, vaccine: 1 });

// Virtual for checking if vaccine is overdue
vaccinationRecordSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed') return false;
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  return dueDate < now;
});

// Virtual for formatted due date
vaccinationRecordSchema.virtual('formattedDueDate').get(function() {
  return this.dueDate ? this.dueDate.toLocaleDateString() : '';
});

// Virtual for formatted vaccination date
vaccinationRecordSchema.virtual('formattedVaccinationDate').get(function() {
  return this.vaccinationDate ? this.vaccinationDate.toLocaleDateString() : '';
});

// Instance method to mark vaccine as completed
vaccinationRecordSchema.methods.markAsCompleted = function(vaccinationDate, batchNo, adverseEffects, bcgScar, notes) {
  this.status = 'completed';
  this.vaccinationDate = vaccinationDate || new Date();
  this.batchNo = batchNo;
  this.adverseEffects = adverseEffects;
  this.bcgScar = bcgScar;
  this.notes = notes;
  this.lastGiven = this.vaccinationDate.toLocaleDateString();
  return this.save();
};

// Instance method to mark vaccine as due
vaccinationRecordSchema.methods.markAsDue = function() {
  this.status = 'due';
  return this.save();
};

// Instance method to mark vaccine as missed
vaccinationRecordSchema.methods.markAsMissed = function() {
  this.status = 'missed';
  return this.save();
};

// Static method to get upcoming vaccines for a baby
vaccinationRecordSchema.statics.getUpcomingForBaby = function(babyId) {
  return this.find({
    baby: babyId,
    status: { $in: ['upcoming', 'due'] }
  }).sort({ dueDate: 1 });
};

// Static method to get missed vaccines for a baby
vaccinationRecordSchema.statics.getMissedForBaby = function(babyId) {
  return this.find({
    baby: babyId,
    status: 'missed'
  }).sort({ dueDate: 1 });
};

// Static method to get completed vaccines for a baby
vaccinationRecordSchema.statics.getCompletedForBaby = function(babyId) {
  return this.find({
    baby: babyId,
    status: 'completed'
  }).sort({ vaccinationDate: -1 });
};

// Static method to get all vaccines for a baby
vaccinationRecordSchema.statics.getAllForBaby = function(babyId) {
  return this.find({ baby: babyId }).sort({ dueDate: 1 });
};

// Function to get the VaccinationRecord model with the correct database connection
let VaccinationRecord = null;

const getVaccinationRecordModel = () => {
  if (!VaccinationRecord) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    
    if (!authConnection) {
      throw new Error('Auth database connection not available');
    }
    
    VaccinationRecord = authConnection.model('VaccinationRecord', vaccinationRecordSchema);
  }
  return VaccinationRecord;
};

module.exports = getVaccinationRecordModel;
