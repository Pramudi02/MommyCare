const mongoose = require('mongoose');

const antenatalVisitSchema = new mongoose.Schema({
  date: Date,
  weight: Number,
  bloodPressure: String,
  fundalHeight: Number,
  fetalHeartRate: Number,
}, { _id: false });

const postnatalVisitSchema = new mongoose.Schema({
  date: Date,
  generalCondition: String,
  bloodPressure: String,
  breastfeedingStatus: String,
  painLevel: Number,
}, { _id: false });

const babyGrowthSchema = new mongoose.Schema({
  date: Date,
  age: String,
  weight: Number,
  length: Number,
  headCircumference: Number,
  bmi: Number,
  whoZScore: Number,
  percentile: Number,
}, { _id: false });

const immunizationSchema = new mongoose.Schema({
  vaccine: String,
  date: Date,
  batchNumber: String,
  adverseEffects: String,
  scarPresence: Boolean,
  status: String,
}, { _id: false });

const postpartumClinicCareSchema = new mongoose.Schema({
  date: Date,
  breastProblems: String,
  abnormalVaginalDischarge: String,
  excessiveVaginalBleeding: String,
  pallor: String,
  jaundice: String,
  oedema: String,
  bloodPressure: String,
  cardiovascularSystem: String,
  respiratorySystem: String,
  abdominalExamination: String,
  vaginalExamination: String,
  mentalStatusScreening: String,
  otherProblems: String,
  actionsTaken: String,
}, { _id: false });

const medicalRecordSchema = new mongoose.Schema({
  mom: { type: mongoose.Schema.Types.ObjectId, ref: 'MomProfile', index: true, required: true, unique: true },
  prePregnancy: {
    lmp: Date,
    quickening: Date,
    amenorrheaAtRegistration: String,
    consanguinity: Boolean,
    rubellaImmunization: Boolean,
    prePregnancyScreening: Boolean,
    preconceptionalFolicAcid: Boolean,
    historyOfSubfertility: Boolean,
    planningPregnancy: Boolean,
    familyPlanningLastUsed: String,
    ageOfYoungestChild: Number,
  },
  antenatalVisits: [antenatalVisitSchema],
  delivery: { type: mongoose.Schema.Types.Mixed },
  babyAtBirth: { type: mongoose.Schema.Types.Mixed },
  babyGrowthMonitoring: [babyGrowthSchema],
  developmentalMilestones: [{ age: String, milestone: String, achieved: Boolean, date: Date }],
  neonatalFollowUps: [{ type: mongoose.Schema.Types.Mixed }],
  immunizations: [immunizationSchema],
  nutritionSupplements: [{ supplement: String, date: Date, age: String, status: String }],
  babyFollowUps: {
    nextClinicDate: Date,
    healthEducationParticipation: Boolean,
    identifiedIllnesses: String,
    specialReferrals: String,
  },
  postpartumFieldCare: {
    identifiedMorbidities: String,
    zScore: Number,
    homeVisitByPHM: Date,
    micronutrientsIssued: Date,
    postpartumClinicVisit: { date: Date, place: String }
  },
  postnatalClinicCare: [postpartumClinicCareSchema],
  medications: [{ name: String, dosage: String, startDate: Date, status: String }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

let MedicalRecord = null;
const getMedicalRecordModel = () => {
  if (!MedicalRecord) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    if (!authConnection) throw new Error('Auth database connection not available');
    MedicalRecord = authConnection.model('MedicalRecord', medicalRecordSchema);
  }
  return MedicalRecord;
};

module.exports = getMedicalRecordModel;
