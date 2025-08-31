const mongoose = require('mongoose');

const babyGrowthSchema = new mongoose.Schema({
  mom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  babyName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  measurements: [{
    date: {
      type: Date,
      required: true
    },
    weight: {
      type: Number,
      required: true,
      min: 0.1,
      max: 100
    },
    height: {
      type: Number,
      required: true,
      min: 0.1,
      max: 100
    },
    headCircumference: {
      type: Number,
      min: 0.1,
      max: 100
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
babyGrowthSchema.index({ mom: 1, 'measurements.date': 1 });

// Virtual for latest measurement
babyGrowthSchema.virtual('latestMeasurement').get(function() {
  if (this.measurements.length === 0) return null;
  return this.measurements[this.measurements.length - 1];
});

// Virtual for age in months
babyGrowthSchema.virtual('ageInMonths').get(function() {
  if (!this.birthDate) return 0;
  const today = new Date();
  const birth = new Date(this.birthDate);
  const diffTime = Math.abs(today - birth);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
});

// Method to add new measurement
babyGrowthSchema.methods.addMeasurement = function(measurementData) {
  // Check if measurement for this date already exists
  const existingIndex = this.measurements.findIndex(
    m => m.date.toDateString() === new Date(measurementData.date).toDateString()
  );
  
  if (existingIndex !== -1) {
    // Update existing measurement
    this.measurements[existingIndex] = measurementData;
  } else {
    // Add new measurement
    this.measurements.push(measurementData);
  }
  
  // Sort measurements by date
  this.measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  this.updatedAt = new Date();
  return this.save();
};

// Method to get measurements within date range
babyGrowthSchema.methods.getMeasurementsInRange = function(startDate, endDate) {
  return this.measurements.filter(measurement => {
    const measurementDate = new Date(measurement.date);
    return measurementDate >= startDate && measurementDate <= endDate;
  });
};

// Method to calculate growth rate
babyGrowthSchema.methods.calculateGrowthRate = function(days = 30) {
  if (this.measurements.length < 2) return null;
  
  const recentMeasurements = this.measurements
    .filter(m => {
      const daysDiff = (new Date() - new Date(m.date)) / (1000 * 60 * 60 * 24);
      return daysDiff <= days;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (recentMeasurements.length < 2) return null;
  
  const first = recentMeasurements[0];
  const last = recentMeasurements[recentMeasurements.length - 1];
  const daysDiff = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);
  
  const weightGain = last.weight - first.weight;
  const heightGain = last.height - first.height;
  
  return {
    weightGainPerDay: weightGain / daysDiff,
    heightGainPerDay: heightGain / daysDiff,
    totalWeightGain: weightGain,
    totalHeightGain: heightGain,
    period: daysDiff
  };
};

// Static method to find baby growth by mom ID
babyGrowthSchema.statics.findByMomId = function(momId) {
  return this.find({ mom: momId }).populate('mom', 'firstName lastName email');
};

// Static method to find baby growth by mom ID and baby name
babyGrowthSchema.statics.findByMomAndBaby = function(momId, babyName) {
  return this.findOne({ mom: momId, babyName: babyName }).populate('mom', 'firstName lastName email');
};

const getBabyGrowthModel = () => {
  if (mongoose.models.BabyGrowth) {
    return mongoose.models.BabyGrowth;
  }
  return mongoose.model('BabyGrowth', babyGrowthSchema);
};

module.exports = getBabyGrowthModel;
