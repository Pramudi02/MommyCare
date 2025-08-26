const mongoose = require('mongoose');

const momProfileSchema = new mongoose.Schema({
  // Reference to the main user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\-\+\(\)\s]+$/, 'Please enter a valid phone number']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [13, 'Age must be at least 13'],
    max: [100, 'Age cannot exceed 100']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood group is required']
  },
  
  // Physical Measurements
  height: {
    value: {
      type: Number,
      required: [true, 'Height value is required'],
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height cannot exceed 250 cm']
    },
    unit: {
      type: String,
      enum: ['cm', 'ft'],
      default: 'cm'
    }
  },
  weight: {
    value: {
      type: Number,
      required: [true, 'Weight value is required'],
      min: [30, 'Weight must be at least 30 kg'],
      max: [200, 'Weight cannot exceed 200 kg']
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  currentBMI: {
    type: Number,
    required: [true, 'Current BMI is required'],
    min: [15, 'BMI must be at least 15'],
    max: [50, 'BMI cannot exceed 50']
  },
  
  // Medical Information
  lmp: {
    type: Date,
    required: [true, 'Last Menstrual Period (LMP) is required']
  },
  edd: {
    type: Date,
    required: [true, 'Expected Due Date (EDD) is required']
  },
  
  // Healthcare Provider Information
  consultantObstetrician: {
    type: String,
    required: [true, 'Consultant Obstetrician is required'],
    trim: true
  },
  
  // Location Information
  mohArea: {
    type: String,
    required: [true, 'MOH Area is required'],
    trim: true
  },
  phmArea: {
    type: String,
    required: [true, 'PHM Area is required'],
    trim: true
  },
  fieldClinic: {
    type: String,
    required: [true, 'Field Clinic is required'],
    trim: true
  },
  gramaNiladhariDivision: {
    type: String,
    required: [true, 'Grama Niladhari Division is required'],
    trim: true
  },
  hospitalClinic: {
    type: String,
    required: [true, 'Hospital Clinic is required'],
    trim: true
  },
  
  // Appointment Information
  nextClinicDate: {
    type: Date,
    required: [true, 'Next Clinic Date is required']
  },
  
  // Additional Information
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    }
  },
  
  // Medical History
  medicalHistory: {
    allergies: [{
      type: String,
      trim: true
    }],
    chronicConditions: [{
      type: String,
      trim: true
    }],
    previousPregnancies: {
      type: Number,
      default: 0,
      min: 0
    },
    complications: [{
      type: String,
      trim: true
    }]
  },
  
  // Current Pregnancy Information
  currentPregnancy: {
    week: {
      type: Number,
      min: 1,
      max: 42
    },
    trimester: {
      type: Number,
      enum: [1, 2, 3]
    },
    isHighRisk: {
      type: Boolean,
      default: false
    },
    riskFactors: [{
      type: String,
      trim: true
    }]
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Profile completion status
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
momProfileSchema.index({ user: 1 }, { unique: true });
momProfileSchema.index({ mohArea: 1 });
momProfileSchema.index({ phmArea: 1 });
momProfileSchema.index({ consultantObstetrician: 1 });

// Virtual for full height display
momProfileSchema.virtual('heightDisplay').get(function() {
  if (!this.height) return '';
  return `${this.height.value} ${this.height.unit}`;
});

// Virtual for full weight display
momProfileSchema.virtual('weightDisplay').get(function() {
  if (!this.weight) return '';
  return `${this.weight.value} ${this.weight.unit}`;
});

// Pre-save middleware to calculate BMI if not provided
momProfileSchema.pre('save', function(next) {
  if (this.height && this.weight && !this.currentBMI) {
    const heightInMeters = this.height.unit === 'cm' ? this.height.value / 100 : this.height.value * 0.3048;
    const weightInKg = this.weight.unit === 'kg' ? this.weight.value : this.weight.value * 0.453592;
    this.currentBMI = Math.round((weightInKg / (heightInMeters * heightInMeters)) * 10) / 10;
  }
  next();
});

// Function to get the MomProfile model with the correct database connection
let MomProfile = null;

const getMomProfileModel = () => {
  if (!MomProfile) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    
    if (!authConnection) {
      throw new Error('Auth database connection not available');
    }
    
    MomProfile = authConnection.model('MomProfile', momProfileSchema);
  }
  return MomProfile;
};

module.exports = getMomProfileModel;
