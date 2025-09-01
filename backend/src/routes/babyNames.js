const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Get all baby names with optional filtering (temporarily removing auth for testing)
router.get('/', async (req, res, next) => {
  try {
    const getBabyNameModel = require('../models/BabyName');
    const BabyName = getBabyNameModel();
    
    const { gender, letter, search, limit = 50 } = req.query;
    
    console.log('Baby names request - Query params:', { gender, letter, search, limit });
    
    let query = {};
    
    // Filter by gender
    if (gender && gender !== 'All Genders') {
      query.gender = gender;
      console.log('Adding gender filter:', gender);
    }
    
    // Filter by starting letter
    if (letter && letter !== 'Any Letter') {
      query.name = { $regex: `^${letter}`, $options: 'i' };
    }
    
    // Search by name or meaning
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log('Final query:', JSON.stringify(query, null, 2));
    
    const names = await BabyName.find(query)
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit));
    
    console.log(`Found ${names.length} names`);
    
    res.json({
      status: 'success',
      data: names
    });
  } catch (err) {
    next(err);
  }
});

// Get popular baby names
router.get('/popular', protect, async (req, res, next) => {
  try {
    const getBabyNameModel = require('../models/BabyName');
    const BabyName = getBabyNameModel();
    
    const { limit = 10 } = req.query;
    
    const names = await BabyName.find()
      .sort({ popularity: -1, likes: -1 })
      .limit(parseInt(limit));
    
    res.json({
      status: 'success',
      data: names
    });
  } catch (err) {
    next(err);
  }
});

// Like a baby name
router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const getBabyNameModel = require('../models/BabyName');
    const BabyName = getBabyNameModel();
    
    const name = await BabyName.findById(req.params.id);
    if (!name) {
      return res.status(404).json({
        status: 'error',
        message: 'Baby name not found'
      });
    }
    
    name.likes += 1;
    await name.save();
    
    res.json({
      status: 'success',
      data: name
    });
  } catch (err) {
    next(err);
  }
});

// Get baby names by gender
router.get('/gender/:gender', protect, async (req, res, next) => {
  try {
    const getBabyNameModel = require('../models/BabyName');
    const BabyName = getBabyNameModel();
    
    const { gender } = req.params;
    const { limit = 50 } = req.query;
    
    const names = await BabyName.find({ gender })
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit));
    
    res.json({
      status: 'success',
      data: names
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
