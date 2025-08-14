const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
	res.json({ status: 'success', data: { message: 'Service Provider dashboard endpoint (stub)' } });
});

router.get('/products', (req, res) => {
	res.json({ status: 'success', data: [] });
});

router.get('/orders', (req, res) => {
	res.json({ status: 'success', data: [] });
});

module.exports = router;
