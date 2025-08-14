const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get conversation between two users
router.get('/:otherUserId', async (req, res) => {
	const { otherUserId } = req.params;
	const userId = req.user._id;
	const msgs = await Message.find({
		$or: [
			{ sender: userId, recipient: otherUserId },
			{ sender: otherUserId, recipient: userId }
		]
	}).sort({ createdAt: 1 });
	res.json({ status: 'success', data: msgs });
});

// Send message
router.post('/send', async (req, res) => {
	const { recipient, content } = req.body;
	const msg = await Message.create({ sender: req.user._id, recipient, content });
	const io = req.app.get('io');
	io.to(`user_${recipient}`).emit('new_message', { from: req.user._id, content, createdAt: msg.createdAt });
	res.status(201).json({ status: 'success', data: msg });
});

// Mark messages as read
router.post('/read', async (req, res) => {
	const { otherUserId } = req.body;
	await Message.updateMany({ sender: otherUserId, recipient: req.user._id, read: false }, { $set: { read: true } });
	res.json({ status: 'success' });
});

module.exports = router;
