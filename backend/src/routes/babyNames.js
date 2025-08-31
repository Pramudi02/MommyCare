const express = require('express');
const router = express.Router();
const controller = require('../controllers/babyNameController');

// Public list endpoint
router.get('/', controller.list);

// Admin bulk insert (can be protected later)
router.post('/bulk', controller.bulkInsert);

module.exports = router;


