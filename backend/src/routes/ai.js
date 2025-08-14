const express = require('express');
const axios = require('axios');
const router = express.Router();

const aiClient = axios.create({
	baseURL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
	headers: { 'x-api-key': process.env.AI_SERVICE_API_KEY || '' },
	timeout: 15000
});

router.get('/health', async (req, res) => {
	try {
		const { data } = await aiClient.get('/health');
		res.json({ status: 'success', data });
	} catch (e) {
		res.status(502).json({ status: 'error', message: 'AI service unavailable' });
	}
});

router.post('/baby-weight', async (req, res) => {
	try {
		const { data } = await aiClient.post('/baby-weight', req.body);
		res.json({ status: 'success', data });
	} catch (e) {
		res.status(400).json({ status: 'error', message: e.response?.data?.message || 'Prediction failed' });
	}
});

router.post('/gestational-diabetes', async (req, res) => {
	try {
		const { data } = await aiClient.post('/gestational-diabetes', req.body);
		res.json({ status: 'success', data });
	} catch (e) {
		res.status(400).json({ status: 'error', message: e.response?.data?.message || 'Prediction failed' });
	}
});

module.exports = router;
