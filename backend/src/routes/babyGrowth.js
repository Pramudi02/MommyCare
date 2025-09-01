const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Create baby growth profile
router.post('/', protect, async (req, res, next) => {
  try {
    const getBabyGrowthModel = require('../models/BabyGrowth');
    const BabyGrowth = getBabyGrowthModel();
    
    const { babyName, gender, birthDate } = req.body;
    
    // Check if baby profile already exists for this mom
    const existingProfile = await BabyGrowth.findOne({
      mom: req.user._id,
      babyName: babyName
    });
    
    if (existingProfile) {
      return res.status(400).json({
        status: 'error',
        message: 'Baby profile already exists with this name'
      });
    }
    
    // Create new baby growth profile
    const babyProfile = await BabyGrowth.create({
      mom: req.user._id,
      babyName,
      gender,
      birthDate: new Date(birthDate),
      measurements: []
    });
    
    await babyProfile.populate('mom', 'firstName lastName email');
    
    res.status(201).json({
      status: 'success',
      message: 'Baby growth profile created successfully',
      data: babyProfile
    });
  } catch (err) {
    next(err);
  }
});

// Get all baby growth profiles for the current mom
router.get('/', protect, async (req, res, next) => {
  try {
    const getBabyGrowthModel = require('../models/BabyGrowth');
    const BabyGrowth = getBabyGrowthModel();
    
    const babyProfiles = await BabyGrowth.findByMomId(req.user._id);
    
    res.json({
      status: 'success',
      data: babyProfiles
    });
  } catch (err) {
    next(err);
  }
});

// Get specific baby growth profile
router.get('/:babyId', protect, async (req, res, next) => {
  try {
    const getBabyGrowthModel = require('../models/BabyGrowth');
    const BabyGrowth = getBabyGrowthModel();
    
    const babyProfile = await BabyGrowth.findOne({
      _id: req.params.babyId,
      mom: req.user._id
    }).populate('mom', 'firstName lastName email');
    
    if (!babyProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Baby growth profile not found'
      });
    }
    
    res.json({
      status: 'success',
      data: babyProfile
    });
  } catch (err) {
    next(err);
  }
});

// Add new measurement
router.post('/:babyId/measurements', protect, async (req, res, next) => {
  try {
    const getBabyGrowthModel = require('../models/BabyGrowth');
    const BabyGrowth = getBabyGrowthModel();
    
    const { date, weight, height, headCircumference, notes } = req.body;
    
    // Validate required fields
    if (!date || weight === undefined || height === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Date, weight, and height are required'
      });
    }
    
    // Find baby profile
    const babyProfile = await BabyGrowth.findOne({
      _id: req.params.babyId,
      mom: req.user._id
    });
    
    if (!babyProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Baby growth profile not found'
      });
    }
    
    // Add measurement
    const measurementData = {
      date: new Date(date),
      weight: parseFloat(weight),
      height: parseFloat(height),
      ...(headCircumference && { headCircumference: parseFloat(headCircumference) }),
      ...(notes && { notes })
    };
    
    await babyProfile.addMeasurement(measurementData);
    
    res.json({
      status: 'success',
      message: 'Measurement added successfully',
      data: babyProfile
    });
  } catch (err) {
    next(err);
  }
});

// Get measurements for a specific baby
router.get('/:babyId/measurements', protect, async (req, res, next) => {
  try {
    const getBabyGrowthModel = require('../models/BabyGrowth');
    const BabyGrowth = getBabyGrowthModel();
    
    const { startDate, endDate } = req.query;
    
    // Find baby profile
    const babyProfile = await BabyGrowth.findOne({
      _id: req.params.babyId,
      mom: req.user._id
    }).populate('mom', 'firstName lastName email');
    
    if (!babyProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Baby growth profile not found'
      });
    }
    
    let measurements = babyProfile.measurements;
    
    // Filter by date range if provided
    if (startDate && endDate) {
      measurements = babyProfile.getMeasurementsInRange(
        new Date(startDate),
        new Date(endDate)
      );
    }
    
    // Sort measurements by date (newest first)
    measurements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      status: 'success',
      data: {
        babyProfile: {
          _id: babyProfile._id,
          babyName: babyProfile.babyName,
          gender: babyProfile.gender,
          birthDate: babyProfile.birthDate,
          ageInMonths: babyProfile.ageInMonths
        },
        measurements,
        totalMeasurements: measurements.length
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
