import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiEdit } from 'react-icons/fi';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [selectedMom, setSelectedMom] = useState(null);
  const [activeTab, setActiveTab] = useState('mom-overview');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const moms = [
    {
      id: 1,
      name: 'Emma Wilson',
      age: 28,
      dueDate: '2024-03-15',
      pregnancyWeek: 32,
      bloodType: 'A+',
      height: '165 cm',
      prePregnancyWeight: '65 kg',
      currentWeight: '78 kg',
      bmi: 28.6,
      mohArea: 'Colombo',
      phmArea: 'Dehiwala',
      fieldClinic: 'Dehiwala Field Clinic',
      gramaNiladhari: 'Dehiwala GN Division',
      hospitalClinic: 'Dehiwala Hospital',
      consultantObstetrician: 'Dr. Perera',
      gravida: 1,
      parity: 0,
      miscarriages: 0,
      stillbirths: 0,
      edd: '2024-10-15',
      riskAssessment: 'low',
      lmp: '2024-01-08',
      quickening: '2024-05-20',
      amenorrheaAtRegistration: '12 weeks',
      consanguinity: false,
      rubellaImmunization: true,
      prePregnancyScreening: true,
      preconceptionalFolicAcid: true,
      historyOfSubfertility: false,
      planningPregnancy: true,
      familyPlanningLastUsed: 'Condom',
      ageOfYoungestChild: null,
      delivery: {
        laborOnset: '2024-10-01T10:00',
        deliveryTime: '2024-10-01T11:30',
        place: 'Hospital A',
        mode: 'normal',
        duration: '1 hour 30 minutes',
        painRelief: 'Pethidine',
        liveBirth: true,
        sexOfBaby: 'Female',
        poa: '40 weeks',
        abnormalitiesDetected: 'None',
        mothersBPAtDischarge: '120/80',
        vitaminAMegadose: true,
        episiotomy: false,
        rubellaImmunizationGiven: true,
        bodyTemperatureNormal: true,
        antiDAntibodiesGiven: false,
        vaginalExaminationDone: true,
        diagnosisCardGiven: false,
        maternalComplications: false,
        woundInfection: false,
        prescriptionGiven: true,
        familyPlanningMethodGiven: 'Pill',
        reasonNotGiven: null,
        postpartumDangerSignalsExplained: true,
        breastfeedingEstablished: true,
        otherNotes: 'Normal delivery, mother and baby doing well'
      },
      babyAtBirth: {
        birthWeight: 3.2,
        birthLength: 52,
        headCircumference: 35,
        apgar1min: 8,
        apgar5min: 9,
        apgar10min: 9,
        dischargeWeight: 3.0,
        vitaminKGiven: true,
        breastfeedingInitiationWithinFirstHour: true,
        breastfeedingAttachment: 'Correct',
        breastfeedingPositioning: 'Correct',
        neonatalHypothyroidismScreening: true,
        hypothyroidismResult: 'Normal',
        neonatalExaminationFindings: 'Normal examination, no abnormalities detected',
        illnessConditionsAtBirth: 'None',
        emergencyContactMOH: '011-2691111',
        emergencyContactPHM: '011-2692222',
        emergencyContactPHI: '011-2693333'
      },
      babyGrowthMonitoring: [
        { 
          date: '2024-10-15', 
          age: 'Birth', 
          weight: 3.2, 
          length: 52, 
          headCircumference: 35, 
          bmi: 11.8,
          whoZScore: 0.5,
          percentile: 75
        },
        { 
          date: '2024-11-15', 
          age: '1 month', 
          weight: 4.1, 
          length: 55, 
          headCircumference: 37, 
          bmi: 13.5,
          whoZScore: 0.8,
          percentile: 80
        },
        { 
          date: '2024-12-15', 
          age: '2 months', 
          weight: 5.2, 
          length: 58, 
          headCircumference: 39, 
          bmi: 15.4,
          whoZScore: 1.2,
          percentile: 85
        }
      ],
      developmentalMilestones: [
        { age: '2 months', milestone: 'Smiles at people', achieved: true, date: '2024-12-15' },
        { age: '2 months', milestone: 'Can briefly calm self', achieved: true, date: '2024-12-15' },
        { age: '2 months', milestone: 'Tries to look at parent', achieved: true, date: '2024-12-15' },
        { age: '4 months', milestone: 'Copies some movements and facial expressions', achieved: false, date: null },
        { age: '4 months', milestone: 'Begins to babble', achieved: false, date: null },
        { age: '6 months', milestone: 'Knows familiar faces', achieved: false, date: null }
      ],
      neonatalFollowUps: [
        {
          visitType: 'Day 1-5',
          date: '2024-10-03',
          skinColor: 'Pink',
          eyesCondition: 'Normal',
          umbilicalCordCondition: 'Normal, no infection',
          temperature: 36.8,
          exclusiveBreastfeeding: true,
          breastfeedingAttachment: 'Correct',
          breastfeedingPositioning: 'Correct',
          identifiedComplications: 'None',
          otherObservations: 'Baby feeding well, passing urine and stools normally'
        },
        {
          visitType: 'Day 6-10',
          date: '2024-10-08',
          skinColor: 'Pink',
          eyesCondition: 'Normal',
          umbilicalCordCondition: 'Cord stump falling off',
          temperature: 36.9,
          exclusiveBreastfeeding: true,
          breastfeedingAttachment: 'Correct',
          breastfeedingPositioning: 'Correct',
          identifiedComplications: 'None',
          otherObservations: 'Weight gain satisfactory, cord stump healing well'
        },
        {
          visitType: 'Day 14-21',
          date: '2024-10-18',
          skinColor: 'Pink',
          eyesCondition: 'Normal',
          umbilicalCordCondition: 'Cord healed completely',
          temperature: 36.7,
          exclusiveBreastfeeding: true,
          breastfeedingAttachment: 'Correct',
          breastfeedingPositioning: 'Correct',
          identifiedComplications: 'None',
          otherObservations: 'Good weight gain, cord site clean and healed'
        },
        {
          visitType: 'Day 42',
          date: '2024-11-26',
          skinColor: 'Pink',
          eyesCondition: 'Normal',
          umbilicalCordCondition: 'Healed',
          temperature: 36.8,
          exclusiveBreastfeeding: true,
          breastfeedingAttachment: 'Correct',
          breastfeedingPositioning: 'Correct',
          identifiedComplications: 'None',
          otherObservations: 'Excellent weight gain, meeting all developmental milestones'
        }
      ],
      immunizations: [
        { vaccine: 'BCG', date: '2024-10-15', batchNumber: 'BCG2024001', adverseEffects: 'None', scarPresence: true, status: 'Completed' },
        { vaccine: 'Hepatitis B', date: '2024-10-15', batchNumber: 'HBV2024001', adverseEffects: 'None', scarPresence: false, status: 'Completed' },
        { vaccine: 'Pentavalent 1', date: '2024-12-15', batchNumber: 'PENT2024001', adverseEffects: 'Mild fever', scarPresence: false, status: 'Completed' },
        { vaccine: 'OPV 1', date: '2024-12-15', batchNumber: 'OPV2024001', adverseEffects: 'None', scarPresence: false, status: 'Completed' },
        { vaccine: 'Pentavalent 2', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' },
        { vaccine: 'OPV 2', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' },
        { vaccine: 'IPV', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' }
      ],
      nutritionSupplements: [
        { supplement: 'Vitamin A', date: '2024-12-15', age: '6 months', status: 'Given' },
        { supplement: 'Deworming', date: null, age: '1 year', status: 'Pending' },
        { supplement: 'Micronutrient Sachet', date: '2024-12-15', age: '6 months', status: 'Given' }
      ],
      babyFollowUps: {
        nextClinicDate: '2025-02-15',
        healthEducationParticipation: true,
        identifiedIllnesses: 'None',
        specialReferrals: 'None'
      },
      antenatalVisits: [
        { date: '2024-02-20', weight: 78, bloodPressure: '120/80', fundalHeight: 28, fetalHeartRate: 140 },
        { date: '2024-03-10', weight: 77, bloodPressure: '118/78', fundalHeight: 30, fetalHeartRate: 138 },
      ],
      postnatalVisits: [
        { date: '2024-03-20', generalCondition: 'Good', bloodPressure: '120/80', breastfeedingStatus: 'Exclusive', painLevel: 3 },
        { date: '2024-04-20', generalCondition: 'Excellent', bloodPressure: '115/75', breastfeedingStatus: 'Mixed', painLevel: 1 },
      ],
      postpartumFieldCare: {
        identifiedMorbidities: 'None',
        zScore: 0.8,
        homeVisitByPHM: '2024-10-05',
        micronutrientsIssued: '2024-10-05',
        postpartumClinicVisit: { date: '2024-10-10', place: 'Dehiwala Hospital' }
      },
      postnatalClinicCare: [
        {
          date: '2024-10-10',
          breastProblems: 'None',
          abnormalVaginalDischarge: 'None',
          excessiveVaginalBleeding: 'None',
          pallor: 'None',
          jaundice: 'None',
          oedema: 'None',
          bloodPressure: '120/80',
          cardiovascularSystem: 'Normal',
          respiratorySystem: 'Normal',
          abdominalExamination: 'Normal',
          vaginalExamination: 'Not needed',
          mentalStatusScreening: 'EPDS Score: 3 (Normal)',
          otherProblems: 'None',
          actionsTaken: 'Routine follow-up scheduled'
        }
      ],
      labResults: {
        hemoglobin: 14.5,
        bloodGroup: 'O+',
        hiv: 'negative',
      },
      medications: [
        { name: 'Iron + Folic Acid', dosage: '1 tablet daily', startDate: '2024-01-15', status: 'Active' },
        { name: 'Calcium', dosage: '500mg twice daily', startDate: '2024-01-15', status: 'Completed' },
      ],
      babyName: 'Emma',
      babyGender: 'Girl',
      phone: '123-456-7890',
    },
    {
      id: 2,
      name: 'Sarah Davis',
      age: 31,
      dueDate: '2024-04-02',
      pregnancyWeek: 28,
      bloodType: 'O+',
      height: '170 cm',
      prePregnancyWeight: '68 kg',
      currentWeight: '75 kg',
      bmi: 26.0,
      mohArea: 'Gampaha',
      phmArea: 'Kelaniya',
      fieldClinic: 'Kelaniya Field Clinic',
      gramaNiladhari: 'Kelaniya GN Division',
      hospitalClinic: 'Kelaniya Hospital',
      consultantObstetrician: 'Dr. Silva',
      gravida: 2,
      parity: 1,
      miscarriages: 1,
      stillbirths: 0,
      edd: '2024-11-20',
      riskAssessment: 'medium',
      lmp: '2024-02-14',
      quickening: '2024-06-10',
      amenorrheaAtRegistration: '10 weeks',
      consanguinity: false,
      rubellaImmunization: true,
      prePregnancyScreening: false,
      preconceptionalFolicAcid: false,
      historyOfSubfertility: false,
      planningPregnancy: true,
      familyPlanningLastUsed: 'Pill',
      ageOfYoungestChild: 3,
      delivery: {
        laborOnset: '2024-10-15T09:00',
        deliveryTime: '2024-10-15T10:30',
        place: 'Hospital B',
        mode: 'cesarean',
        duration: '2 hours',
        painRelief: 'Pethidine, Morphine',
        liveBirth: true,
        sexOfBaby: 'Male',
        poa: '39 weeks',
        abnormalitiesDetected: 'None',
        mothersBPAtDischarge: '125/85',
        vitaminAMegadose: true,
        episiotomy: false,
        rubellaImmunizationGiven: true,
        bodyTemperatureNormal: true,
        antiDAntibodiesGiven: false,
        vaginalExaminationDone: true,
        diagnosisCardGiven: false,
        maternalComplications: false,
        woundInfection: false,
        prescriptionGiven: true,
        familyPlanningMethodGiven: 'Injection',
        reasonNotGiven: null,
        postpartumDangerSignalsExplained: true,
        breastfeedingEstablished: true,
        otherNotes: 'Elective LSCS, mother and baby doing well'
      },
      babyAtBirth: {
        birthWeight: 3.5,
        birthLength: 50,
        headCircumference: 34,
        apgar1min: 9,
        apgar5min: 10,
        apgar10min: 10,
        dischargeWeight: 3.3,
        vitaminKGiven: true,
        breastfeedingInitiationWithinFirstHour: true,
        breastfeedingAttachment: 'Correct',
        breastfeedingPositioning: 'Correct',
        neonatalHypothyroidismScreening: true,
        hypothyroidismResult: 'Normal',
        neonatalExaminationFindings: 'Normal examination, no abnormalities detected',
        illnessConditionsAtBirth: 'None',
        emergencyContactMOH: '011-2694444',
        emergencyContactPHM: '011-2695555',
        emergencyContactPHI: '011-2696666'
      },
      babyGrowthMonitoring: [
        { 
          date: '2024-10-15', 
          age: 'Birth', 
          weight: 3.5, 
          length: 50, 
          headCircumference: 34, 
          bmi: 14.0,
          whoZScore: 0.2,
          percentile: 60
        },
        { 
          date: '2024-11-15', 
          age: '1 month', 
          weight: 4.3, 
          length: 54, 
          headCircumference: 36, 
          bmi: 14.7,
          whoZScore: 0.4,
          percentile: 65
        }
      ],
      developmentalMilestones: [
        { age: '2 months', milestone: 'Smiles at people', achieved: true, date: '2024-12-15' },
        { age: '2 months', milestone: 'Can briefly calm self', achieved: true, date: '2024-12-15' },
        { age: '2 months', milestone: 'Tries to look at parent', achieved: true, date: '2024-12-15' }
      ],
      neonatalFollowUps: [
        {
          visitType: 'Day 1-5',
          date: '2024-10-17',
          skinColor: 'Pink',
          eyesCondition: 'Normal',
          umbilicalCordCondition: 'Normal, no infection',
          temperature: 36.9,
          exclusiveBreastfeeding: true,
          breastfeedingAttachment: 'Correct',
          breastfeedingPositioning: 'Correct',
          identifiedComplications: 'None',
          otherObservations: 'Baby feeding well, wound site clean'
        }
      ],
      immunizations: [
        { vaccine: 'BCG', date: '2024-10-15', batchNumber: 'BCG2024002', adverseEffects: 'None', scarPresence: true, status: 'Completed' },
        { vaccine: 'Hepatitis B', date: '2024-10-15', batchNumber: 'HBV2024002', adverseEffects: 'None', scarPresence: false, status: 'Completed' },
        { vaccine: 'Pentavalent 1', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' },
        { vaccine: 'OPV 1', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' }
      ],
      nutritionSupplements: [
        { supplement: 'Vitamin A', date: null, age: '6 months', status: 'Pending' },
        { supplement: 'Deworming', date: null, age: '1 year', status: 'Pending' },
        { supplement: 'Micronutrient Sachet', date: null, age: '6 months', status: 'Pending' }
      ],
      babyFollowUps: {
        nextClinicDate: '2024-12-15',
        healthEducationParticipation: true,
        identifiedIllnesses: 'None',
        specialReferrals: 'None'
      },
      antenatalVisits: [
        { date: '2024-03-01', weight: 70, bloodPressure: '110/70', fundalHeight: 25, fetalHeartRate: 145 },
        { date: '2024-03-15', weight: 72, bloodPressure: '115/75', fundalHeight: 27, fetalHeartRate: 142 },
      ],
      postnatalVisits: [
        { date: '2024-04-05', generalCondition: 'Fair', bloodPressure: '125/85', breastfeedingStatus: 'Mixed', painLevel: 5 },
        { date: '2024-05-05', generalCondition: 'Good', bloodPressure: '120/80', breastfeedingStatus: 'Formula', painLevel: 2 },
      ],
      postpartumFieldCare: {
        identifiedMorbidities: 'None',
        zScore: 0.5,
        homeVisitByPHM: '2024-10-18',
        micronutrientsIssued: '2024-10-18',
        postpartumClinicVisit: { date: '2024-10-22', place: 'Kelaniya Hospital' }
      },
      postnatalClinicCare: [
        {
          date: '2024-10-22',
          breastProblems: 'None',
          abnormalVaginalDischarge: 'None',
          excessiveVaginalBleeding: 'None',
          pallor: 'None',
          jaundice: 'None',
          oedema: 'None',
          bloodPressure: '125/85',
          cardiovascularSystem: 'Normal',
          respiratorySystem: 'Normal',
          abdominalExamination: 'Normal',
          vaginalExamination: 'Not needed',
          mentalStatusScreening: 'EPDS Score: 5 (Mild)',
          otherProblems: 'None',
          actionsTaken: 'Routine follow-up scheduled'
        }
      ],
      labResults: {
        hemoglobin: 13.8,
        bloodGroup: 'O-',
        hiv: 'negative',
      },
      medications: [
        { name: 'Doxycycline', dosage: '100mg daily', startDate: '2024-02-01', status: 'Active' },
        { name: 'Nifedipine', dosage: '10mg daily', startDate: '2024-03-01', status: 'Completed' },
      ],
      babyName: 'Liam',
      babyGender: 'Boy',
      phone: '987-654-3210',
    },
    {
      id: 3,
      name: 'Maria Garcia',
      age: 25,
      dueDate: '2024-02-28',
      pregnancyWeek: 38,
      bloodType: 'B+',
      height: '162 cm',
      prePregnancyWeight: '62 kg',
      currentWeight: '80 kg',
      bmi: 30.5,
      mohArea: 'Kalutara',
      phmArea: 'Panadura',
      fieldClinic: 'Panadura Field Clinic',
      gramaNiladhari: 'Panadura GN Division',
      hospitalClinic: 'Panadura Hospital',
      consultantObstetrician: 'Dr. Fernando',
      gravida: 3,
      parity: 2,
      miscarriages: 2,
      stillbirths: 1,
      edd: '2024-12-01',
      riskAssessment: 'high',
      lmp: '2024-03-01',
      quickening: '2024-07-15',
      amenorrheaAtRegistration: '8 weeks',
      consanguinity: false,
      rubellaImmunization: false,
      prePregnancyScreening: false,
      preconceptionalFolicAcid: false,
      historyOfSubfertility: true,
      planningPregnancy: false,
      familyPlanningLastUsed: 'None',
      ageOfYoungestChild: 5,
      delivery: {
        laborOnset: '2024-11-10T11:00',
        deliveryTime: '2024-11-10T12:00',
        place: 'Hospital C',
        mode: 'forceps',
        duration: '1 hour',
        painRelief: 'Pethidine, Morphine',
        liveBirth: true,
        sexOfBaby: 'Female',
        poa: '38 weeks',
        abnormalitiesDetected: 'None',
        mothersBPAtDischarge: '130/90',
        vitaminAMegadose: true,
        episiotomy: true,
        rubellaImmunizationGiven: true,
        bodyTemperatureNormal: true,
        antiDAntibodiesGiven: false,
        vaginalExaminationDone: true,
        diagnosisCardGiven: true,
        maternalComplications: false,
        woundInfection: false,
        prescriptionGiven: true,
        familyPlanningMethodGiven: 'Tubal ligation',
        reasonNotGiven: null,
        postpartumDangerSignalsExplained: true,
        breastfeedingEstablished: true,
        otherNotes: 'Forceps delivery due to fetal distress, mother and baby doing well'
      },
      babyAtBirth: {
        birthWeight: 3.8,
        birthLength: 51,
        headCircumference: 36,
        apgar1min: 7,
        apgar5min: 8,
        apgar10min: 9,
        dischargeWeight: 3.6,
        vitaminKGiven: true,
        breastfeedingInitiationWithinFirstHour: false,
        breastfeedingAttachment: 'Incorrect',
        breastfeedingPositioning: 'Incorrect',
        neonatalHypothyroidismScreening: true,
        hypothyroidismResult: 'Normal',
        neonatalExaminationFindings: 'Normal examination, mild bruising on head from forceps',
        illnessConditionsAtBirth: 'Mild bruising from forceps delivery',
        emergencyContactMOH: '011-2697777',
        emergencyContactPHM: '011-2698888',
        emergencyContactPHI: '011-2699999'
      },
      babyGrowthMonitoring: [
        { 
          date: '2024-11-10', 
          age: 'Birth', 
          weight: 3.8, 
          length: 51, 
          headCircumference: 36, 
          bmi: 14.6,
          whoZScore: 0.8,
          percentile: 80
        }
      ],
      developmentalMilestones: [
        { age: '2 months', milestone: 'Smiles at people', achieved: false, date: null },
        { age: '2 months', milestone: 'Can briefly calm self', achieved: false, date: null },
        { age: '2 months', milestone: 'Tries to look at parent', achieved: false, date: null }
      ],
      neonatalFollowUps: [
        {
          visitType: 'Day 1-5',
          date: '2024-11-12',
          skinColor: 'Pink with mild bruising',
          eyesCondition: 'Normal',
          umbilicalCordCondition: 'Normal, no infection',
          temperature: 37.0,
          exclusiveBreastfeeding: false,
          breastfeedingAttachment: 'Incorrect',
          breastfeedingPositioning: 'Incorrect',
          identifiedComplications: 'Breastfeeding difficulties',
          otherObservations: 'Baby has feeding difficulties, bruising resolving well'
        }
      ],
      immunizations: [
        { vaccine: 'BCG', date: '2024-11-10', batchNumber: 'BCG2024003', adverseEffects: 'None', scarPresence: true, status: 'Completed' },
        { vaccine: 'Hepatitis B', date: '2024-11-10', batchNumber: 'HBV2024003', adverseEffects: 'None', scarPresence: false, status: 'Completed' },
        { vaccine: 'Pentavalent 1', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' },
        { vaccine: 'OPV 1', date: null, batchNumber: null, adverseEffects: null, scarPresence: false, status: 'Pending' }
      ],
      nutritionSupplements: [
        { supplement: 'Vitamin A', date: null, age: '6 months', status: 'Pending' },
        { supplement: 'Deworming', date: null, age: '1 year', status: 'Pending' },
        { supplement: 'Micronutrient Sachet', date: null, age: '6 months', status: 'Pending' }
      ],
      babyFollowUps: {
        nextClinicDate: '2024-12-10',
        healthEducationParticipation: true,
        identifiedIllnesses: 'Breastfeeding difficulties',
        specialReferrals: 'Lactation consultant'
      },
      antenatalVisits: [
        { date: '2024-01-01', weight: 75, bloodPressure: '120/80', fundalHeight: 20, fetalHeartRate: 150 },
        { date: '2024-01-15', weight: 76, bloodPressure: '122/82', fundalHeight: 22, fetalHeartRate: 148 },
      ],
      postnatalVisits: [
        { date: '2024-02-10', generalCondition: 'Poor', bloodPressure: '130/90', breastfeedingStatus: 'Formula', painLevel: 8 },
        { date: '2024-03-10', generalCondition: 'Fair', bloodPressure: '125/85', breastfeedingStatus: 'Mixed', painLevel: 5 },
      ],
      postpartumFieldCare: {
        identifiedMorbidities: 'Breastfeeding difficulties',
        zScore: 0.3,
        homeVisitByPHM: '2024-11-13',
        micronutrientsIssued: '2024-11-13',
        postpartumClinicVisit: { date: '2024-11-18', place: 'Panadura Hospital' }
      },
      postnatalClinicCare: [
        {
          date: '2024-11-18',
          breastProblems: 'Engorgement',
          abnormalVaginalDischarge: 'None',
          excessiveVaginalBleeding: 'None',
          pallor: 'None',
          jaundice: 'None',
          oedema: 'None',
          bloodPressure: '130/90',
          cardiovascularSystem: 'Normal',
          respiratorySystem: 'Normal',
          abdominalExamination: 'Normal',
          vaginalExamination: 'Not needed',
          mentalStatusScreening: 'EPDS Score: 8 (Moderate)',
          otherProblems: 'Breastfeeding difficulties',
          actionsTaken: 'Referred to lactation consultant, scheduled follow-up'
        }
      ],
      labResults: {
        hemoglobin: 12.0,
        bloodGroup: 'AB+',
        hiv: 'positive',
      },
      medications: [
        { name: 'Ibuprofen', dosage: '200mg daily', startDate: '2024-01-01', status: 'Active' },
        { name: 'Hydroxychloroquine', dosage: '200mg daily', startDate: '2024-02-01', status: 'Completed' },
      ],
      babyName: 'Emma',
      babyGender: 'Girl',
      phone: '112-358-1321',
    },
  ];

  const [records, setRecords] = useState({
    1: {
      overview: {
        allergies: 'None',
        chronicConditions: 'None',
        medications: 'Prenatal vitamins',
        familyHistory: 'Mother had gestational diabetes',
        lifestyle: 'Non-smoker, occasional alcohol before pregnancy',
      },
      vitals: [
        { date: '2024-02-20', weight: 78, bloodPressure: '120/80', temperature: 36.8 },
        { date: '2024-02-13', weight: 77, bloodPressure: '118/78', temperature: 36.9 },
        { date: '2024-02-06', weight: 76, bloodPressure: '122/82', temperature: 36.7 },
      ],
      medications: [
        { name: 'Prenatal Vitamins', dosage: '1 tablet daily', startDate: '2024-01-01', status: 'Active' },
      ],
    },
  });

  const handleMomSelect = (mom) => {
    setSelectedMom(mom);
    setActiveTab('mom-overview');
    setIsEditing(false);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const updateOverviewField = (field, value) => {
    if (!selectedMom) return;
    setRecords((prev) => ({
      ...prev,
      [selectedMom.id]: {
        ...prev[selectedMom.id],
        overview: {
          ...((prev[selectedMom.id] && prev[selectedMom.id].overview) || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateVitalsRow = (idx, field, value) => {
    if (!selectedMom) return;
    setRecords((prev) => {
      const prevVitals = (prev[selectedMom.id]?.vitals || []).slice();
      prevVitals[idx] = { ...prevVitals[idx], [field]: value };
      return { ...prev, [selectedMom.id]: { ...prev[selectedMom.id], vitals: prevVitals } };
    });
  };

  return (
    <div className="medical-records-page">
      <div className="medical-records-container">
        <div className="medical-records-content">
          <div className="medical-records-header">
        <div className="medical-records-header-icon">
          <FiEdit2 className="w-6 h-6" />
        </div>
        <div className="medical-records-title">
            <h1>Medical Records</h1>
            <p>Manage and track patient medical history and pregnancy records</p>
        </div>
      </div>

        <div className="medical-records-filters">
          <div className="medical-records-search">
            <input
              type="text"
              placeholder="Search patients..."
              className="search-input"
            />
          </div>
        </div>

        <div className="medical-records-main-content">
        {/* Moms Selection */}
        <div className="moms-selection">
          <h3>Select Patient</h3>
            <div className="moms-list">
            {moms.map((mom) => (
              <div
                key={mom.id}
                className={`mom-card ${selectedMom?.id === mom.id ? 'active' : ''}`}
                onClick={() => handleMomSelect(mom)}
              >
                <div className="mom-avatar">{mom.name.charAt(0)}</div>
                <div className="mom-info">
                  <h4>{mom.name}</h4>
                  <p>Week {mom.pregnancyWeek} • Due: {formatDate(mom.dueDate)}</p>
                  <p>Blood Type: {mom.bloodType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Records Display */}
        {selectedMom ? (
          <div className="records-display">
            <div className="records-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>{selectedMom.name}'s Medical Records</h2>
                <div className="patient-summary">
                  <span>Age: {selectedMom.age}</span>
                  <span>Blood Type: {selectedMom.bloodType}</span>
                  <span>Height: {selectedMom.height}</span>
                  <span>Current Weight: {selectedMom.currentWeight}</span>
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <button className="action-btn primary" onClick={() => setIsEditing(true)}><FiEdit2 /> Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="action-btn primary" onClick={() => setIsEditing(false)}><FiSave /> Save</button>
                    <button className="action-btn secondary" onClick={() => setIsEditing(false)}><FiX /> Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="records-tabs">
              <div className="tab-group">
                <button 
                  className={`tab-btn ${activeTab.startsWith('mom') ? 'active' : ''}`}
                  onClick={() => setActiveTab('mom-overview')}
                >
                  Mom
                </button>
                <button 
                  className={`tab-btn ${activeTab.startsWith('baby') ? 'active' : ''}`}
                  onClick={() => setActiveTab('baby-care')}
                >
                  Baby
                </button>
              </div>

              {/* Mom Sub-tabs */}
              {activeTab.startsWith('mom') && (
                <div className="sub-tabs">
                  <button 
                    className={`sub-tab ${activeTab === 'mom-overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-overview')}
                  >
                Overview
              </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-general')}
                  >
                General & Pre-pregnancy
              </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-pregnancy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-pregnancy')}
                  >
                Pregnancy History
              </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-antenatal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-antenatal')}
                  >
                    Antenatal Care
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-delivery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-delivery')}
                  >
                    Delivery
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-postnatal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-postnatal')}
                  >
                    Postnatal Care
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-field-care' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-field-care')}
                  >
                    Postpartum Field Care
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-clinic-care' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-clinic-care')}
                  >
                    Postnatal Clinic Care
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-vitals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-vitals')}
                  >
                Vitals
              </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-medications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-medications')}
                  >
                Medications
              </button>
                </div>
              )}

              {/* Baby Sub-tabs */}
              {activeTab.startsWith('baby') && (
                <div className="sub-tabs">
                  <button 
                    className={`sub-tab ${activeTab === 'baby-birth' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-birth')}
                  >
                    Birth & Immediate Care
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-care' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-care')}
                  >
                    Baby Care
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-growth' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-growth')}
                  >
                    Growth Monitoring
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-development' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-development')}
                  >
                    Developmental Milestones
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-neonatal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-neonatal')}
                  >
                    Neonatal Follow-ups
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-immunizations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-immunizations')}
                  >
                    Immunizations
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-nutrition' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-nutrition')}
                  >
                    Nutrition & Supplements
                  </button>
                  <button 
                    className={`sub-tab ${activeTab === 'baby-followups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('baby-followups')}
                  >
                    Other Follow-ups
                  </button>
                </div>
              )}
            </div>

            <div className="tab-content">
              {/* Mom Overview Tab */}
              {activeTab === 'mom-overview' && (
                <div className="overview-content">
                  <div className="overview-grid">
                    <div className="overview-field">
                      <label>Name</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                        value={selectedMom.name} 
                        disabled={!isEditing}
                      />
                      </div>
                    <div className="overview-field">
                      <label>Age</label>
                      <input 
                        type="number" 
                        className="overview-input" 
                        value={selectedMom.age} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Phone</label>
                      <input 
                        type="tel" 
                        className="overview-input" 
                        value={selectedMom.phone} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Blood Group</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                        value={selectedMom.bloodGroup} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Height</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                        value={selectedMom.height} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Weight</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                        value={selectedMom.currentWeight} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Next Clinic Date</label>
                      <input 
                        type="date" 
                        className="overview-input" 
                        value={selectedMom.nextClinicDate || ''} 
                        onChange={(e) => {
                          const updatedMom = { ...selectedMom };
                          updatedMom.nextClinicDate = e.target.value;
                          setSelectedMom(updatedMom);
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mom General & Pre-pregnancy Tab */}
              {activeTab === 'mom-general' && (
                <div className="general-content">
                  <div className="general-header">
                    <h3>General & Pre-pregnancy Data</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Record
                    </button>
                  </div>
                  <div className="general-grid">
                    <div className="general-field">
                      <label>BMI</label>
                      <input 
                        type="number" 
                        className="general-input" 
                        value={selectedMom.bmi || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>MOH Area</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.mohArea || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>PHM Area</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.phmArea || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Field Clinic</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.fieldClinic || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Grama Niladhari Division</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.gramaNiladhari || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Hospital Clinic</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.hospitalClinic || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Consultant Obstetrician</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.consultantObstetrician || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>LMP (Last Menstrual Period)</label>
                      <input 
                        type="date" 
                        className="general-input" 
                        value={selectedMom.lmp || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Date of Quickening</label>
                      <input 
                        type="date" 
                        className="general-input" 
                        value={selectedMom.quickening || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Period of Amenorrhea at Registration</label>
                      <input 
                        type="text" 
                        className="general-input" 
                        value={selectedMom.amenorrheaAtRegistration || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Age of Youngest Child</label>
                      <input 
                        type="number" 
                        className="general-input" 
                        value={selectedMom.ageOfYoungestChild || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="checklist-section">
                    <div className="checklist-grid">
                      <div className="checklist-item">
                        <label>Consanguinity</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.consanguinity ? 'yes' : 'no'} 
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Rubella Immunization</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.rubellaImmunization ? 'yes' : 'no'} 
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Pre-pregnancy Screening Done</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.prePregnancyScreening ? 'yes' : 'no'} 
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Preconceptional Folic Acid</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.preconceptionalFolicAcid ? 'yes' : 'no'} 
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>History of Subfertility</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.historyOfSubfertility ? 'yes' : 'no'} 
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Planning Pregnancy</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.planningPregnancy ? 'yes' : 'no'} 
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Family Planning Method Last Used</label>
                        <select 
                          className="checklist-input" 
                          value={selectedMom.familyPlanningLastUsed || ''} 
                          disabled={!isEditing}
                        >
                          <option value="">Select method...</option>
                          <option value="T">T</option>
                          <option value="L">L</option>
                          <option value="IP">IP</option>
                          <option value="N">N</option>
                          <option value="V">V</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mom Pregnancy History Tab */}
              {activeTab === 'mom-pregnancy' && (
                <div className="pregnancy-content">
                  <div className="pregnancy-grid">
                    <div className="pregnancy-field">
                      <label>Gravida</label>
                      <input 
                        type="number" 
                        className="pregnancy-input" 
                        value={selectedMom.gravida || ''} 
                        disabled={!isEditing}
                      />
                          </div>
                    <div className="pregnancy-field">
                      <label>Parity</label>
                      <input 
                        type="number" 
                        className="pregnancy-input" 
                        value={selectedMom.parity || ''} 
                        disabled={!isEditing}
                      />
                          </div>
                    <div className="pregnancy-field">
                      <label>Miscarriages</label>
                      <input 
                        type="number" 
                        className="pregnancy-input" 
                        value={selectedMom.miscarriages || ''} 
                        disabled={!isEditing}
                      />
                        </div>
                    <div className="pregnancy-field">
                      <label>Stillbirths</label>
                      <input 
                        type="number" 
                        className="pregnancy-input" 
                        value={selectedMom.stillbirths || ''} 
                        disabled={!isEditing}
                      />
                      </div>
                    <div className="pregnancy-field">
                      <label>Due Date</label>
                      <input 
                        type="date" 
                        className="pregnancy-input" 
                        value={selectedMom.edd || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="pregnancy-field">
                      <label>Risk Assessment</label>
                      <select 
                        className="pregnancy-input" 
                        value={selectedMom.riskAssessment || ''} 
                        disabled={!isEditing}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Mom Antenatal Care Tab */}
              {activeTab === 'mom-antenatal' && (
                <div className="antenatal-content">
                  <div className="antenatal-header">
                    <h3>Antenatal Visits</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Visit
                    </button>
                  </div>
                  {selectedMom.antenatalVisits && selectedMom.antenatalVisits.length > 0 ? (
                    selectedMom.antenatalVisits.map((visit, index) => (
                      <div key={index} className="visit-record">
                        <div className="visit-record-header">
                          <h4>Visit {index + 1} - {formatDate(visit.date)}</h4>
                          <button className="edit-visit-btn">
                            <FiEdit size={14} />
                          </button>
                        </div>
                        <div className="visit-record-grid">
                          <div className="visit-field">
                            <label>Weight (kg)</label>
                            <input 
                              type="number" 
                              className="visit-input" 
                              value={visit.weight} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="visit-field">
                            <label>Blood Pressure</label>
                            <input 
                              type="text" 
                              className="visit-input" 
                              value={visit.bloodPressure} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="visit-field">
                            <label>Fundal Height (cm)</label>
                            <input 
                              type="number" 
                              className="visit-input" 
                              value={visit.fundalHeight} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="visit-field">
                            <label>Fetal Heart Rate</label>
                            <input 
                              type="number" 
                              className="visit-input" 
                              value={visit.fetalHeartRate} 
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No antenatal visits recorded yet.</p>
                          )}
                        </div>
              )}

              {/* Mom Delivery Tab */}
              {activeTab === 'mom-delivery' && (
                <div className="delivery-content">
                  <div className="delivery-header">
                    <h3>Delivery Details</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Record
                    </button>
                    </div>
                  {selectedMom.delivery ? (
                    <div className="delivery-grid">
                      <div className="delivery-field">
                        <label>Labor Onset</label>
                        <input 
                          type="datetime-local" 
                          className="delivery-input" 
                          value={selectedMom.delivery.laborOnset || ''} 
                          disabled={!isEditing}
                        />
                  </div>
                      <div className="delivery-field">
                        <label>Delivery Time</label>
                        <input 
                          type="datetime-local" 
                          className="delivery-input" 
                          value={selectedMom.delivery.deliveryTime || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="delivery-field">
                        <label>Place</label>
                        <input 
                          type="text" 
                          className="delivery-input" 
                          value={selectedMom.delivery.place || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="delivery-field">
                        <label>Mode</label>
                        <select 
                          className="delivery-input" 
                          value={selectedMom.delivery.mode || ''} 
                          disabled={!isEditing}
                        >
                          <option value="normal">Normal</option>
                          <option value="cesarean">Cesarean</option>
                          <option value="forceps">Forceps</option>
                          <option value="vacuum">Vacuum</option>
                        </select>
                      </div>
                      <div className="delivery-field">
                        <label>Duration</label>
                        <input 
                          type="text" 
                          className="delivery-input" 
                          value={selectedMom.delivery.duration || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="delivery-field">
                        <label>Pain Relief</label>
                        <input 
                          type="text" 
                          className="delivery-input" 
                          value={selectedMom.delivery.painRelief || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  ) : (
                    <p>No delivery details recorded yet.</p>
                  )}
                </div>
              )}

              {/* Mom Postpartum Field Care Tab */}
              {activeTab === 'mom-field-care' && (
                <div className="field-care-content">
                  <div className="field-care-header">
                    <h3>Postpartum Field Care</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Record
                    </button>
                  </div>
                  <div className="field-care-grid">
                    <div className="field-care-field">
                      <label>Identified Postpartum Morbidities</label>
                          <textarea
                        className="field-care-input" 
                        value={selectedMom.postpartumFieldCare?.identifiedMorbidities || ''} 
                        disabled={!isEditing}
                            rows="3"
                      />
                    </div>
                    <div className="field-care-field">
                      <label>Z-score of Mother (Nutritional Status)</label>
                      <input 
                        type="number" 
                        className="field-care-input" 
                        value={selectedMom.postpartumFieldCare?.zScore || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="field-care-field">
                      <label>Date of Home Visit by PHM</label>
                      <input 
                        type="date" 
                        className="field-care-input" 
                        value={selectedMom.postpartumFieldCare?.homeVisitByPHM || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="field-care-field">
                      <label>Date Micronutrients Issued</label>
                      <input 
                        type="date" 
                        className="field-care-input" 
                        value={selectedMom.postpartumFieldCare?.micronutrientsIssued || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="field-care-field">
                      <label>Postpartum Clinic Visit Date</label>
                      <input 
                        type="date" 
                        className="field-care-input" 
                        value={selectedMom.postpartumFieldCare?.postpartumClinicVisit?.date || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="field-care-field">
                      <label>Postpartum Clinic Visit Place</label>
                      <input 
                        type="text" 
                        className="field-care-input" 
                        value={selectedMom.postpartumFieldCare?.postpartumClinicVisit?.place || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mom Postnatal Clinic Care Tab */}
              {activeTab === 'mom-clinic-care' && (
                <div className="clinic-care-content">
                  <div className="clinic-care-header">
                    <h3>Postnatal Clinic Care</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Visit
                    </button>
                      </div>
                  {selectedMom.postnatalClinicCare && selectedMom.postnatalClinicCare.length > 0 ? (
                    selectedMom.postnatalClinicCare.map((visit, index) => (
                      <div key={index} className="clinic-visit-record">
                        <div className="clinic-visit-header">
                          <h4>Visit {index + 1} - {formatDate(visit.date)}</h4>
                          <button className="edit-visit-btn">
                            <FiEdit size={14} />
                          </button>
                  </div>
                        <div className="clinic-visit-grid">
                          <div className="clinic-field">
                            <label>Breast Problems</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.breastProblems} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Abnormal Vaginal Discharge</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.abnormalVaginalDischarge} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Excessive Vaginal Bleeding</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.excessiveVaginalBleeding} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Pallor</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.pallor} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Jaundice</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.jaundice} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Oedema (Ankle/Facial)</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.oedema} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Blood Pressure</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.bloodPressure} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Cardiovascular System</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.cardiovascularSystem} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Respiratory System</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.respiratorySystem} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Abdominal Examination</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.abdominalExamination} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Vaginal Examination</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.vaginalExamination} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Mental Status Screening (EPDS)</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.mentalStatusScreening} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Other Problems</label>
                            <input 
                              type="text" 
                              className="clinic-input" 
                              value={visit.otherProblems} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="clinic-field">
                            <label>Actions Taken</label>
                            <textarea 
                              className="clinic-input" 
                              value={visit.actionsTaken} 
                              disabled={!isEditing}
                              rows="3"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No postnatal clinic care visits recorded yet.</p>
                  )}
                </div>
              )}

              {/* Mom Postnatal Care Tab */}
              {activeTab === 'mom-postnatal' && (
                <div className="postnatal-content">
                  <div className="postnatal-header">
                    <h3>Postnatal Care</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Visit
                    </button>
                          </div>
                  <div className="postnatal-visits">
                    <div className="postnatal-grid">
                      <div className="postnatal-field">
                        <label>Postnatal Visits</label>
                        <input 
                          type="number" 
                          className="postnatal-input" 
                          value="3" 
                          disabled={!isEditing}
                        />
                          </div>
                      <div className="postnatal-field">
                        <label>Last Visit Date</label>
                        <input 
                          type="date" 
                          className="postnatal-input" 
                          value="2024-03-20" 
                          disabled={!isEditing}
                        />
                        </div>
                      <div className="postnatal-field">
                        <label>Recovery Status</label>
                        <select 
                          className="postnatal-input" 
                          value="good" 
                          disabled={!isEditing}
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mom Vitals Tab */}
              {activeTab === 'mom-vitals' && (
                <div className="vitals-content">
                  <div className="vitals-header">
                    <h3>Vital Signs</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Vitals
                    </button>
                  </div>
                  <div className="vitals-grid">
                    <div className="vitals-field">
                      <label>Blood Pressure</label>
                      <input 
                        type="text" 
                        className="vitals-input" 
                        value="120/80" 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="vitals-field">
                      <label>Pulse Rate</label>
                      <input 
                        type="number" 
                        className="vitals-input" 
                        value="72" 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="vitals-field">
                      <label>Temperature</label>
                      <input 
                        type="number" 
                        className="vitals-input" 
                        value="36.8" 
                        disabled={!isEditing}
                      />
                        </div>
                    <div className="vitals-field">
                      <label>Respiratory Rate</label>
                      <input 
                        type="number" 
                        className="vitals-input" 
                        value="16" 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mom Medications Tab */}
              {activeTab === 'mom-medications' && (
                <div className="medications-content">
                  <div className="medications-header">
                    <h3>Medications</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Medication
                    </button>
                  </div>
                  <div className="medications-list">
                    <div className="medication-item">
                      <div className="medication-header">
                        <span className="medication-name">Iron + Folic Acid</span>
                        <span className="medication-status active">Active</span>
                        </div>
                      <div className="medication-details">
                        <p>Dosage: 1 tablet daily</p>
                        <p>Duration: Throughout pregnancy</p>
                        <p>Started: 2024-01-15</p>
                      </div>
                    </div>
                    <div className="medication-item">
                      <div className="medication-header">
                        <span className="medication-name">Calcium</span>
                        <span className="medication-status completed">Completed</span>
                      </div>
                      <div className="medication-details">
                        <p>Dosage: 500mg twice daily</p>
                        <p>Duration: 3 months</p>
                        <p>Started: 2024-01-15</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baby Birth & Immediate Care Tab */}
              {activeTab === 'baby-birth' && (
                <div className="birth-care-content">
                  <div className="birth-header">
                    <h3>Birth & Immediate Care</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Record
                    </button>
                  </div>
                  <div className="birth-grid">
                    <div className="birth-field">
                      <label>Baby Name</label>
                      <input 
                        type="text" 
                        className="birth-input" 
                        value={selectedMom.babyName || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Date of Birth</label>
                      <input 
                        type="date" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.dateOfBirth || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Birth Order</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.birthOrder || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Mode of Delivery</label>
                      <select 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.modeOfDelivery || ''} 
                        disabled={!isEditing}
                      >
                        <option value="normal">Normal</option>
                        <option value="cesarean">Cesarean</option>
                        <option value="forceps">Forceps</option>
                        <option value="vacuum">Vacuum</option>
                      </select>
                    </div>
                    <div className="birth-field">
                      <label>APGAR Score (1 min)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.apgar1min || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>APGAR Score (5 min)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.apgar5min || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>APGAR Score (10 min)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.apgar10min || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Birth Weight (kg)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.birthWeight || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Birth Length (cm)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.birthLength || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Head Circumference (cm)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.headCircumference || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Discharge Weight (kg)</label>
                      <input 
                        type="number" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.dischargeWeight || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Vitamin K Given</label>
                      <select 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.vitaminKGiven ? 'yes' : 'no'} 
                        disabled={!isEditing}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="birth-field">
                      <label>Breastfeeding Initiation (within 1st hour)</label>
                      <select 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.breastfeedingInitiationWithinFirstHour ? 'yes' : 'no'} 
                        disabled={!isEditing}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="birth-field">
                      <label>Breastfeeding Attachment</label>
                      <select 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.breastfeedingAttachment || ''} 
                        disabled={!isEditing}
                      >
                        <option value="Correct">Correct</option>
                        <option value="Incorrect">Incorrect</option>
                      </select>
                    </div>
                    <div className="birth-field">
                      <label>Breastfeeding Positioning</label>
                      <select 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.breastfeedingPositioning || ''} 
                        disabled={!isEditing}
                      >
                        <option value="Correct">Correct</option>
                        <option value="Incorrect">Incorrect</option>
                      </select>
                    </div>
                    <div className="birth-field">
                      <label>Neonatal Hypothyroidism Screening</label>
                      <select 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.neonatalHypothyroidismScreening ? 'yes' : 'no'} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Hypothyroidism Result</label>
                      <input 
                        type="text" 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.hypothyroidismResult || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="birth-field">
                      <label>Neonatal Examination Findings</label>
                      <textarea 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.neonatalExaminationFindings || ''} 
                        disabled={!isEditing}
                        rows="3"
                      />
                    </div>
                    <div className="birth-field">
                      <label>Illness/Conditions at Birth</label>
                      <textarea 
                        className="birth-input" 
                        value={selectedMom.babyAtBirth?.illnessConditionsAtBirth || ''} 
                        disabled={!isEditing}
                        rows="3"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* Baby Care Tab */}
              {activeTab === 'baby-care' && (
                <div className="baby-care-content">
                  <div className="baby-info-section">
                    <h3>Baby Information</h3>
                    <div className="baby-grid">
                      <div className="baby-field">
                        <label>Name</label>
                        <input 
                          type="text" 
                          className="baby-input" 
                          value={selectedMom.babyName || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="baby-field">
                        <label>Gender</label>
                        <select 
                          className="baby-input" 
                          value={selectedMom.babyGender || ''} 
                          disabled={!isEditing}
                        >
                          <option value="Boy">Boy</option>
                          <option value="Girl">Girl</option>
                        </select>
                      </div>
                      <div className="baby-field">
                        <label>Birth Weight (kg)</label>
                        <input 
                          type="number" 
                          className="baby-input" 
                          value={selectedMom.babyAtBirth?.birthWeight || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="baby-field">
                        <label>Birth Length (cm)</label>
                        <input 
                          type="number" 
                          className="baby-input" 
                          value={selectedMom.babyAtBirth?.birthLength || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="baby-field">
                        <label>Head Circumference (cm)</label>
                        <input 
                          type="number" 
                          className="baby-input" 
                          value={selectedMom.babyAtBirth?.headCircumference || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="baby-field">
                        <label>APGAR Score (1 min)</label>
                        <input 
                          type="number" 
                          className="baby-input" 
                          value={selectedMom.babyAtBirth?.apgar1min || ''} 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baby Growth Monitoring Tab */}
              {activeTab === 'baby-growth' && (
                <div className="growth-monitoring-content">
                  <div className="growth-header">
                    <h3>Growth & Development Monitoring</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Measurement
                    </button>
                  </div>
                  <div className="growth-summary">
                    <h4>Current Growth Status</h4>
                    <div className="growth-summary-grid">
                      <div className="growth-summary-item">
                        <span className="growth-value">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.weight || 'N/A'} kg</span>
                        <span className="growth-percentile">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.percentile || 'N/A'}th percentile</span>
                      </div>
                      <div className="growth-summary-item">
                        <span className="growth-value">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.length || 'N/A'} cm</span>
                        <span className="growth-percentile">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.percentile || 'N/A'}th percentile</span>
                      </div>
                      <div className="growth-summary-item">
                        <span className="growth-value">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.headCircumference || 'N/A'} cm</span>
                        <span className="growth-percentile">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.percentile || 'N/A'}th percentile</span>
                      </div>
                      <div className="growth-summary-item">
                        <span className="growth-value">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.bmi || 'N/A'}</span>
                        <span className="growth-percentile">BMI</span>
                      </div>
                      <div className="growth-summary-item">
                        <span className="growth-value">{selectedMom.babyGrowthMonitoring?.[selectedMom.babyGrowthMonitoring.length - 1]?.whoZScore || 'N/A'}</span>
                        <span className="growth-percentile">WHO Z-Score</span>
                      </div>
                    </div>
                  </div>
                  <div className="growth-records-list">
                    <h4>Monthly Growth Records (up to 5 years)</h4>
                    {selectedMom.babyGrowthMonitoring && selectedMom.babyGrowthMonitoring.length > 0 ? (
                      selectedMom.babyGrowthMonitoring.map((record, index) => (
                        <div key={index} className="growth-record">
                          <div className="growth-record-header">
                            <span>Visit Date: {formatDate(record.date)} - Age: {record.age}</span>
                            <button className="edit-visit-btn">
                              <FiEdit size={14} />
                            </button>
                          </div>
                          <div className="growth-record-grid">
                            <div className="growth-field">
                              <label>Weight (kg)</label>
                              <input 
                                type="number" 
                                className="growth-input" 
                                value={record.weight} 
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="growth-field">
                              <label>Length (cm)</label>
                              <input 
                                type="number" 
                                className="growth-input" 
                                value={record.length} 
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="growth-field">
                              <label>Head Circumference (cm)</label>
                              <input 
                                type="number" 
                                className="growth-input" 
                                value={record.headCircumference} 
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="growth-field">
                              <label>BMI</label>
                              <input 
                                type="number" 
                                className="growth-input" 
                                value={record.bmi} 
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="growth-field">
                              <label>WHO Z-Score</label>
                              <input 
                                type="number" 
                                className="growth-input" 
                                value={record.whoZScore} 
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="growth-field">
                              <label>Percentile</label>
                              <input 
                                type="number" 
                                className="growth-input" 
                                value={record.percentile} 
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No growth records available yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Baby Immunizations Tab */}
              {activeTab === 'baby-immunizations' && (
                <div className="immunization-content">
                  <div className="immunization-header">
                    <h3>Immunization Schedule</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Vaccine
                    </button>
                  </div>
                  <div className="immunization-schedule">
                    <div className="schedule-grid">
                      {selectedMom.immunizations && selectedMom.immunizations.length > 0 ? (
                        selectedMom.immunizations.map((vaccine, index) => (
                          <div key={index} className={`schedule-item ${vaccine.status === 'Completed' ? 'completed' : 'pending'}`}>
                            <div className="schedule-header">
                              <span className="vaccine-name">{vaccine.vaccine}</span>
                              <span className={`schedule-status ${vaccine.status === 'Completed' ? 'completed' : 'pending'}`}>
                                {vaccine.status}
                              </span>
                            </div>
                            <div className="schedule-details">
                              <p><strong>Date:</strong> {vaccine.date ? formatDate(vaccine.date) : 'N/A'}</p>
                              <p><strong>Batch Number:</strong> {vaccine.batchNumber || 'N/A'}</p>
                              <p><strong>Adverse Effects:</strong> {vaccine.adverseEffects || 'None'}</p>
                              <p><strong>Scar Presence:</strong> {vaccine.scarPresence ? 'Yes' : 'No'}</p>
                              {vaccine.vaccine === 'BCG' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> N/A</p>
                              )}
                              {vaccine.vaccine === 'Hepatitis B' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> {vaccine.date ? new Date(vaccine.date).toISOString().split('T')[0] : 'N/A'}</p>
                              )}
                              {vaccine.vaccine === 'Pentavalent 1' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 4 months</p>
                              )}
                              {vaccine.vaccine === 'Pentavalent 2' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 6 months</p>
                              )}
                              {vaccine.vaccine === 'Pentavalent 3' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 9 months</p>
                              )}
                              {vaccine.vaccine === 'OPV 1' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 4 months</p>
                              )}
                              {vaccine.vaccine === 'OPV 2' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 6 months</p>
                              )}
                              {vaccine.vaccine === 'OPV 3' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 9 months</p>
                              )}
                              {vaccine.vaccine === 'IPV' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 9 months</p>
                              )}
                              {vaccine.vaccine === 'MMR 1' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 12 months</p>
                              )}
                              {vaccine.vaccine === 'Live JE' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 18 months</p>
                              )}
                              {vaccine.vaccine === 'DPT booster' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 3 years</p>
                              )}
                              {vaccine.vaccine === 'OPV 4' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 3 years</p>
                              )}
                              {vaccine.vaccine === 'MMR 2' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 5 years</p>
                              )}
                              {vaccine.vaccine === 'DT' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 11 years</p>
                              )}
                              {vaccine.vaccine === 'OPV 5' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> 11 years</p>
                              )}
                              {vaccine.vaccine === 'Adult Tetanus & Diphtheria' && vaccine.status === 'Completed' && (
                                <p><strong>Next Due:</strong> N/A</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No immunization records available yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="immunization-schedule-info">
                    <h4>Complete Immunization Schedule</h4>
                    <div className="schedule-timeline">
                      <div className="timeline-item">
                        <span className="timeline-age">At Birth</span>
                        <span className="timeline-vaccines">BCG, Hepatitis B</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">2 Months</span>
                        <span className="timeline-vaccines">Pentavalent 1, OPV 1</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">4 Months</span>
                        <span className="timeline-vaccines">Pentavalent 2, OPV 2, IPV</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">6 Months</span>
                        <span className="timeline-vaccines">Pentavalent 3, OPV 3</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">9 Months</span>
                        <span className="timeline-vaccines">MMR 1</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">12 Months</span>
                        <span className="timeline-vaccines">Live JE</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">18 Months</span>
                        <span className="timeline-vaccines">DPT booster, OPV 4</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">3 Years</span>
                        <span className="timeline-vaccines">MMR 2</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">5 Years</span>
                        <span className="timeline-vaccines">DT, OPV 5</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-age">11 Years</span>
                        <span className="timeline-vaccines">Adult Tetanus & Diphtheria</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baby Developmental Milestones Tab */}
              {activeTab === 'baby-development' && (
                <div className="development-content">
                  <div className="development-header">
                    <h3>Developmental Milestones Screening</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Milestone
                    </button>
                  </div>
                  {selectedMom.developmentalMilestones && selectedMom.developmentalMilestones.length > 0 ? (
                    <div className="milestones-list">
                      {selectedMom.developmentalMilestones.map((milestone, index) => (
                        <div key={index} className="milestone-record">
                          <div className="milestone-header">
                            <h4>{milestone.age} - {milestone.milestone}</h4>
                            <span className={`milestone-status ${milestone.achieved ? 'achieved' : 'pending'}`}>
                              {milestone.achieved ? 'Achieved' : 'Pending'}
                            </span>
                          </div>
                          <div className="milestone-details">
                            <div className="milestone-field">
                              <label>Achievement Date</label>
                              <input 
                                type="date" 
                                className="milestone-input" 
                                value={milestone.date || ''} 
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No developmental milestones recorded yet.</p>
                  )}
                  </div>
              )}

              {/* Baby Neonatal Follow-ups Tab */}
              {activeTab === 'baby-neonatal' && (
                <div className="neonatal-content">
                  <div className="neonatal-header">
                    <h3>Neonatal & Infant Period Follow-ups</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Visit
                    </button>
                  </div>
                  {selectedMom.neonatalFollowUps && selectedMom.neonatalFollowUps.length > 0 ? (
                    selectedMom.neonatalFollowUps.map((visit, index) => (
                      <div key={index} className="neonatal-visit-record">
                        <div className="neonatal-visit-header">
                          <h4>{visit.visitType} - {formatDate(visit.date)}</h4>
                          <button className="edit-visit-btn">
                            <FiEdit size={14} />
                          </button>
                        </div>
                        <div className="neonatal-visit-grid">
                          <div className="neonatal-field">
                            <label>Skin Color</label>
                            <input 
                              type="text" 
                              className="neonatal-input" 
                              value={visit.skinColor} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="neonatal-field">
                            <label>Eyes Condition</label>
                            <input 
                              type="text" 
                              className="neonatal-input" 
                              value={visit.eyesCondition} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="neonatal-field">
                            <label>Umbilical Cord Condition</label>
                            <input 
                              type="text" 
                              className="neonatal-input" 
                              value={visit.umbilicalCordCondition} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="neonatal-field">
                            <label>Temperature</label>
                            <input 
                              type="number" 
                              className="neonatal-input" 
                              value={visit.temperature} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="neonatal-field">
                            <label>Exclusive Breastfeeding</label>
                            <select 
                              className="neonatal-input" 
                              value={visit.exclusiveBreastfeeding ? 'yes' : 'no'} 
                              disabled={!isEditing}
                            >
                              <option value="no">No</option>
                              <option value="yes">Yes</option>
                            </select>
                          </div>
                          <div className="neonatal-field">
                            <label>Breastfeeding Attachment</label>
                            <select 
                              className="neonatal-input" 
                              value={visit.breastfeedingAttachment} 
                              disabled={!isEditing}
                            >
                              <option value="Correct">Correct</option>
                              <option value="Incorrect">Incorrect</option>
                            </select>
                          </div>
                          <div className="neonatal-field">
                            <label>Breastfeeding Positioning</label>
                            <select 
                              className="neonatal-input" 
                              value={visit.breastfeedingPositioning} 
                              disabled={!isEditing}
                            >
                              <option value="Correct">Correct</option>
                              <option value="Incorrect">Incorrect</option>
                            </select>
                          </div>
                          <div className="neonatal-field">
                            <label>Identified Complications</label>
                            <input 
                              type="text" 
                              className="neonatal-input" 
                              value={visit.identifiedComplications} 
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="neonatal-field">
                            <label>Other Observations</label>
                            <textarea 
                              className="neonatal-input" 
                              value={visit.otherObservations} 
                              disabled={!isEditing}
                              rows="3"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No neonatal follow-up visits recorded yet.</p>
                  )}
                </div>
              )}

              {/* Baby Nutrition & Supplements Tab */}
              {activeTab === 'baby-nutrition' && (
                <div className="nutrition-content">
                  <div className="nutrition-header">
                    <h3>Nutrition & Supplements</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Supplement
                    </button>
                        </div>
                  {selectedMom.nutritionSupplements && selectedMom.nutritionSupplements.length > 0 ? (
                    <div className="supplements-list">
                      {selectedMom.nutritionSupplements.map((supplement, index) => (
                        <div key={index} className="supplement-record">
                          <div className="supplement-header">
                            <h4>{supplement.supplement} - {supplement.age}</h4>
                            <span className={`supplement-status ${supplement.status === 'Given' ? 'given' : 'pending'}`}>
                              {supplement.status}
                            </span>
                          </div>
                          <div className="supplement-details">
                            <div className="supplement-field">
                              <label>Date Given</label>
                              <input 
                                type="date" 
                                className="supplement-input" 
                                value={supplement.date || ''} 
                                disabled={!isEditing}
                              />
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <p>No nutrition supplements recorded yet.</p>
                  )}
                </div>
              )}

              {/* Baby Other Follow-ups Tab */}
              {activeTab === 'baby-followups' && (
                <div className="followups-content">
                  <div className="followups-header">
                    <h3>Other Baby Follow-ups</h3>
                    <button className="add-record-btn" onClick={() => setShowAddRecord(true)}>
                      <FiPlus size={16} />
                      Add Follow-up
                    </button>
            </div>
                  <div className="followups-grid">
                    <div className="followup-field">
                      <label>Next Clinic Date</label>
                      <input 
                        type="date" 
                        className="followup-input" 
                        value={selectedMom.babyFollowUps?.nextClinicDate || ''} 
                        onChange={(e) => {
                          const updatedMom = { ...selectedMom };
                          if (!updatedMom.babyFollowUps) updatedMom.babyFollowUps = {};
                          updatedMom.babyFollowUps.nextClinicDate = e.target.value;
                          setSelectedMom(updatedMom);
                        }}
                        disabled={!isEditing}
                      />
          </div>
                    <div className="followup-field">
                      <label>Health Education Session Participation</label>
                      <select 
                        className="followup-input" 
                        value={selectedMom.babyFollowUps?.healthEducationParticipation ? 'yes' : 'no'} 
                        disabled={!isEditing}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="followup-field">
                      <label>Identified Illnesses</label>
                      <input 
                        type="text" 
                        className="followup-input" 
                        value={selectedMom.babyFollowUps?.identifiedIllnesses || ''} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="followup-field">
                      <label>Special Referrals</label>
                      <textarea 
                        className="followup-input" 
                        value={selectedMom.babyFollowUps?.specialReferrals || ''} 
                        disabled={!isEditing}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        ) : (
          <div className="no-selection">
            <div className="no-selection-icon">👩‍⚕️</div>
            <h3>Select a Patient</h3>
            <p>Choose a patient from the list above to view their medical records.</p>
          </div>
        )}
      </div>

      {/* Emergency Contact Information Section */}
      {selectedMom && (
        <div className="emergency-contacts-section">
          <h3>Emergency Contact Information</h3>
          <div className="emergency-contacts-grid">
            <div className="emergency-contact-field">
              <label>Emergency Contact MOH</label>
              <input 
                type="tel" 
                className="emergency-contact-input" 
                value={selectedMom.emergencyContactMOH || ''} 
                disabled={!isEditing}
                placeholder="Enter MOH contact number"
              />
            </div>
            <div className="emergency-contact-field">
              <label>Emergency Contact PHM</label>
              <input 
                type="tel" 
                className="emergency-contact-input" 
                value={selectedMom.emergencyContactPHM || ''} 
                disabled={!isEditing}
                placeholder="Enter PHM contact number"
              />
            </div>
            <div className="emergency-contact-field">
              <label>Emergency Contact PHI</label>
              <input 
                type="tel" 
                className="emergency-contact-input" 
                value={selectedMom.emergencyContactPHI || ''} 
                disabled={!isEditing}
                placeholder="Enter PHI contact number"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal (unchanged) */}
      {showAddRecord && (
        <div className="modal-overlay" onClick={() => setShowAddRecord(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Medical Record</h2>
              <button className="close-btn" onClick={() => setShowAddRecord(false)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Record Type</label>
                <select className="form-input">
                  <option value="">Select type...</option>
                  <option value="prenatal">Prenatal Checkup</option>
                  <option value="ultrasound">Ultrasound</option>
                  <option value="blood-test">Blood Test</option>
                  <option value="vitals">Vitals Check</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label>Findings</label>
                <textarea className="form-input" rows="4" placeholder="Enter medical findings..."></textarea>
              </div>
              <div className="form-group">
                <label>Recommendations</label>
                <textarea className="form-input" rows="3" placeholder="Enter recommendations..."></textarea>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowAddRecord(false)}>Cancel</button>
              <button className="modal-btn primary">Add Record</button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
