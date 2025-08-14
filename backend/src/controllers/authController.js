const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signTokenResponse = (user) => {
	const token = user.getSignedJwtToken();
	return {
		token,
		user: {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
			role: user.role,
			avatar: user.avatar
		}
	};
};

// POST /api/auth/register
exports.register = async (req, res) => {
	const { firstName, lastName, email, phone, password, role, gender } = req.body;

	const existing = await User.findOne({ email });
	if (existing) {
		return res.status(400).json({ status: 'error', message: 'Email already in use' });
	}

	const user = await User.create({ firstName, lastName, email, phone, password, role, gender });
	const response = signTokenResponse(user);
	return res.status(201).json({ status: 'success', ...response });
};

// POST /api/auth/login
exports.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
	}

	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		await user.incLoginAttempts();
		return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
	}

	await user.resetLoginAttempts();
	const response = signTokenResponse(user);
	return res.status(200).json({ status: 'success', ...response });
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
	return res.status(200).json({ status: 'success', message: 'Logged out' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
	return res.status(200).json({ status: 'success', user: req.user });
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
	const allowed = ['firstName', 'lastName', 'phone', 'avatar', 'address', 'preferences'];
	const updates = {};
	for (const key of allowed) {
		if (req.body[key] !== undefined) updates[key] = req.body[key];
	}

	const updated = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true });
	return res.status(200).json({ status: 'success', user: updated });
};

// PUT /api/auth/password
exports.updatePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	const user = await User.findById(req.user.id).select('+password');
	if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

	const isMatch = await user.matchPassword(currentPassword);
	if (!isMatch) return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });

	user.password = newPassword;
	await user.save();
	const response = signTokenResponse(user);
	return res.status(200).json({ status: 'success', ...response });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(200).json({ status: 'success', message: 'If that email exists, a reset link has been sent' });

	const resetToken = crypto.randomBytes(20).toString('hex');
	user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
	await user.save({ validateBeforeSave: false });

	// TODO: send email via email service
	return res.status(200).json({ status: 'success', message: 'Password reset token generated', resetToken });
};

// POST /api/auth/reset-password/:resetToken
exports.resetPassword = async (req, res) => {
	const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
	const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpire: { $gt: Date.now() } }).select('+password');
	if (!user) return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });

	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpire = undefined;
	await user.save();
	const response = signTokenResponse(user);
	return res.status(200).json({ status: 'success', ...response });
};

// GET /api/auth/verify-email/:token (stub)
exports.verifyEmail = async (req, res) => {
	return res.status(200).json({ status: 'success', message: 'Email verified (stub)' });
};

// POST /api/auth/resend-verification (stub)
exports.resendVerificationEmail = async (req, res) => {
	return res.status(200).json({ status: 'success', message: 'Verification email sent (stub)' });
};

// POST /api/auth/refresh-token (stub)
exports.refreshToken = async (req, res) => {
	return res.status(200).json({ status: 'success', message: 'Token refreshed (stub)' });
};
