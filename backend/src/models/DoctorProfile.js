const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  // Reference to the main user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Personal Information
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\-\+\(\)\s]+$/, 'Please enter a valid phone number']
  },
  age: {
    type: Number,
    min: [25, 'Age must be at least 25'],
    max: [100, 'Age cannot exceed 100']
  },

  // Hospital Information
  hospitalInformation: {
    hospitalName: {
      type: String,
      trim: true,
      maxlength: [200, 'Hospital name cannot be more than 200 characters']
    },
    hospitalAddress: {
      type: String,
      trim: true,
      maxlength: [500, 'Hospital address cannot be more than 500 characters']
    },
    hospitalPhone: {
      type: String,
      trim: true,
      match: [/^[\d\-\+\(\)\s]+$/, 'Please enter a valid phone number']
    },
    hospitalEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },

  // Professional Information
  professionalInformation: {
    specialization: {
      type: [String],
      enum: [
        'Obstetrics & Gynecology',
        'Cardiology',
        'Pediatrics',
        'Radiology',
        'Dental Health',
        'General Medicine',
        'Surgery',
        'Psychiatry',
        'Neurology',
        'Oncology',
        'Emergency Medicine',
        'Family Medicine',
        'Internal Medicine',
        'Dermatology',
        'Orthopedics',
        'Anesthesiology',
        'Pathology',
        'Other'
      ],
      default: []
    },
    medicalRegistrationNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Medical registration number cannot be more than 50 characters']
    },
    licenseNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'License number cannot be more than 50 characters']
    },
    yearsOfExperience: {
      type: String,
      enum: [
        'Less than 1 year',
        '1-2 years',
        '3-5 years',
        '6-10 years',
        '11-15 years',
        '16-20 years',
        '21-25 years',
        '26-30 years',
        'More than 30 years'
      ]
    },
    education: {
      type: String,
      trim: true,
      maxlength: [200, 'Education cannot be more than 200 characters']
    },
    certifications: {
      type: [String],
      default: []
    }
  },

  // Location Details
  locationDetails: {
    streetAddress: {
      type: String,
      trim: true,
      maxlength: [300, 'Street address cannot be more than 300 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City cannot be more than 100 characters']
    },
    stateProvince: {
      type: String,
      trim: true,
      maxlength: [100, 'State/Province cannot be more than 100 characters']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country cannot be more than 100 characters']
    },
    zipPostalCode: {
      type: String,
      trim: true,
      maxlength: [20, 'ZIP/Postal code cannot be more than 20 characters']
    }
  },

  // Business Stats (auto-calculated or manually updated)
  businessStats: {
    yearsExperience: {
      type: Number,
      default: 0
    },
    patientsServed: {
      type: Number,
      default: 0
    }
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
doctorProfileSchema.index({ user: 1 }, { unique: true });
doctorProfileSchema.index({ 'professionalInformation.specialization': 1 });
doctorProfileSchema.index({ 'locationDetails.city': 1 });
doctorProfileSchema.index({ 'locationDetails.country': 1 });

let DoctorProfile = null;

const getDoctorProfileModel = () => {
  if (!DoctorProfile) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    
    if (!authConnection) {
      throw new Error('Auth database connection not available');
    }
    
    DoctorProfile = authConnection.model('DoctorProfile', doctorProfileSchema);
  }
  return DoctorProfile;
};

module.exports = getDoctorProfileModel;
