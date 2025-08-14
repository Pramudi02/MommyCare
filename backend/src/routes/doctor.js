const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
	res.json({ status: 'success', data: { message: 'Doctor dashboard endpoint (stub)' } });
});

router.get('/patients', (req, res) => {
	res.json({ status: 'success', data: [] });
});

router.get('/appointments', (req, res) => {
	res.json({ status: 'success', data: [] });
});

module.exports = router;
