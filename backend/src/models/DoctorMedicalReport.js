const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  dosage: { type: String, trim: true },
  duration: { type: String, trim: true }
}, { _id: false });

const testResultSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  result: { type: String, trim: true },
  summary: { type: String, trim: true }
}, { _id: false });

const additionalFieldSchema = new mongoose.Schema({
  label: { type: String, trim: true },
  value: { type: String, trim: true }
}, { _id: false });

const doctorMedicalReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  patientInformation: {
    fullName: { type: String, trim: true },
    age: Number,
    dateOfBirth: Date,
    gender: { type: String, trim: true },
    contactDetails: { type: String, trim: true },
    idNumber: { type: String, trim: true }
  },

  doctorInformation: {
    name: { type: String, trim: true },
    specialization: { type: String, trim: true },
    hospitalClinic: { type: String, trim: true }
  },

  visitDetails: {
    visitDate: Date,
    reasonForVisit: { type: String, trim: true },
    symptoms: { type: String, trim: true }
  },

  examination: {
    vitalSigns: {
      bloodPressure: { type: String, trim: true },
      pulse: { type: String, trim: true },
      temperature: { type: String, trim: true }
    },
    physicalFindings: { type: String, trim: true }
  },

  diagnosis: {
    condition: { type: String, trim: true },
    severity: { type: String, trim: true }
  },

  treatmentPlan: {
    medications: [medicationSchema],
    nonDrugTreatments: [{ type: String, trim: true }]
  },

  labResults: {
    tests: [testResultSchema]
  },

  notesRecommendations: {
    advice: { type: String, trim: true },
    lifestyle: { type: String, trim: true },
    dietary: { type: String, trim: true }
  },

  followUp: {
    nextAppointmentDate: Date,
    monitoringRequirements: { type: String, trim: true }
  },

  additionalFields: {
    type: [additionalFieldSchema],
    validate: [arr => (arr?.length || 0) <= 10, 'Maximum of 10 additional fields allowed']
  }
}, { timestamps: true });

let DoctorMedicalReport = null;

const getDoctorMedicalReportModel = () => {
  if (!DoctorMedicalReport) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    if (!authConnection) {
      throw new Error('Auth database connection not available');
    }
    DoctorMedicalReport = authConnection.model('DoctorMedicalReport', doctorMedicalReportSchema);
  }
  return DoctorMedicalReport;
};

module.exports = getDoctorMedicalReportModel;


