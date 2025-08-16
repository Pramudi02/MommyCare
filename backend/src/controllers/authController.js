const getUserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to create token response
const signTokenResponse = (user) => {
	const token = user.getSignedJwtToken();
	return {
		token,
		user: {
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
			isEmailVerified: user.isEmailVerified,
			isActive: user.isActive
		}
	};
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
	try {
		console.log('Registration request received:', req.body);
		const { firstName, lastName, email, password, role, phone, gender } = req.body;

		// Validate required fields
		if (!firstName || !lastName || !email || !password || !role) {
			console.log('Missing required fields:', { firstName, lastName, email, password, role });
			return res.status(400).json({ 
				status: 'error', 
				message: 'Missing required fields',
				required: ['firstName', 'lastName', 'email', 'password', 'role']
			});
		}

		// Check if user already exists
		const User = getUserModel();
		console.log('Checking for existing user with email:', email);
		
		let existingUser;
		try {
			existingUser = await User.findOne({ email });
		} catch (dbError) {
			console.error('Database error checking existing user:', dbError);
			return res.status(503).json({ 
				status: 'error', 
				message: 'Database temporarily unavailable. Please try again in a moment.'
			});
		}
		
		if (existingUser) {
			console.log('User already exists with email:', email);
			return res.status(400).json({ status: 'error', message: 'Email already in use' });
		}

		console.log('Creating new user...');
		let user;
		try {
			user = await User.create({ firstName, lastName, email, password, role, phone, gender });
			console.log('User created successfully:', user._id);
		} catch (createError) {
			console.error('Error creating user:', createError);
			
			// Handle specific MongoDB errors
			if (createError.code === 11000) {
				return res.status(400).json({ status: 'error', message: 'Email already in use' });
			}
			
			if (createError.name === 'ValidationError') {
				const validationErrors = Object.values(createError.errors).map(err => err.message);
				return res.status(400).json({ 
					status: 'error', 
					message: 'Validation failed',
					errors: validationErrors
				});
			}
			
			return res.status(503).json({ 
				status: 'error', 
				message: 'Database temporarily unavailable. Please try again in a moment.'
			});
		}
		
		const response = signTokenResponse(user);
		return res.status(201).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Registration error:', error);
		
		// Handle specific MongoDB errors
		if (error.code === 11000) {
			return res.status(400).json({ status: 'error', message: 'Email already in use' });
		}
		
		if (error.name === 'ValidationError') {
			const validationErrors = Object.values(error.errors).map(err => err.message);
			return res.status(400).json({ 
				status: 'error', 
				message: 'Validation failed',
				errors: validationErrors
			});
		}
		
		return res.status(500).json({ status: 'error', message: 'Server error during registration' });
	}
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate email and password
		if (!email || !password) {
			return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
		}

		// Check for user
		const User = getUserModel();
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
		}

		// Check if account is locked
		if (user.isLocked) {
			return res.status(423).json({ status: 'error', message: 'Account is locked due to too many failed login attempts' });
		}

		// Reset login attempts on successful login
		await User.resetLoginAttempts(email);

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		const response = signTokenResponse(user);
		return res.status(200).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error during login' });
	}
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
	try {
		const User = getUserModel();
		const user = await User.findById(req.user.id);
		return res.status(200).json({ status: 'success', user });
	} catch (error) {
		console.error('Get me error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
	try {
		// Clear refresh tokens for the user
		const User = getUserModel();
		await User.findByIdAndUpdate(req.user.id, { $set: { refreshTokens: [] } });

		return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
	} catch (error) {
		console.error('Logout error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error during logout' });
	}
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, phone, avatar } = req.body;
		const User = getUserModel();
		
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ firstName, lastName, phone, avatar },
			{ new: true, runValidators: true }
		);

		return res.status(200).json({ status: 'success', user });
	} catch (error) {
		console.error('Update profile error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const User = getUserModel();
		
		const user = await User.findById(req.user.id).select('+password');
		
		// Check current password
		const isMatch = await user.matchPassword(currentPassword);
		if (!isMatch) {
			return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
		}

		user.password = newPassword;
		user.lastPasswordChange = new Date();
		await user.save();

		return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
	} catch (error) {
		console.error('Update password error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const User = getUserModel();
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ status: 'error', message: 'User not found' });
		}

		// Generate reset token
		const resetToken = user.getResetPasswordToken();
		await user.save({ validateBeforeSave: false });

		// TODO: Send email with reset token
		// For now, just return the token (in production, send via email)
		return res.status(200).json({
			status: 'success',
			message: 'Password reset email sent',
			resetToken: resetToken // Remove this in production
		});
	} catch (error) {
		console.error('Forgot password error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
	try {
		const { resetToken } = req.params;
		const { password } = req.body;

		// Get hashed token
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		const User = getUserModel();
		const user = await User.findOne({
			passwordResetToken: resetPasswordToken,
			passwordResetExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
		}

		// Set new password
		user.password = password;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		user.lastPasswordChange = new Date();
		await user.save();

		const response = signTokenResponse(user);
		return res.status(200).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Reset password error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
	try {
		const { token } = req.params;
		const User = getUserModel();
		
		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({ status: 'error', message: 'Invalid or expired verification token' });
		}

		user.isEmailVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		return res.status(200).json({ status: 'success', message: 'Email verified successfully' });
	} catch (error) {
		console.error('Verify email error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerificationEmail = async (req, res) => {
	try {
		const User = getUserModel();
		const user = await User.findById(req.user.id);

		if (user.isEmailVerified) {
			return res.status(400).json({ status: 'error', message: 'Email is already verified' });
		}

		// Generate new verification token
		const verificationToken = crypto.randomBytes(20).toString('hex');
		user.emailVerificationToken = crypto
			.createHash('sha256')
			.update(verificationToken)
			.digest('hex');
		user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
		await user.save({ validateBeforeSave: false });

		// TODO: Send verification email
		return res.status(200).json({ 
			status: 'success', 
			message: 'Verification email sent',
			verificationToken: verificationToken // Remove this in production
		});
	} catch (error) {
		console.error('Resend verification error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Private
const refreshToken = async (req, res) => {
	try {
		const User = getUserModel();
		const user = await User.findById(req.user.id);
		
		const response = signTokenResponse(user);
		return res.status(200).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Refresh token error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

module.exports = {
	register,
	login,
	getMe,
	logout,
	updateProfile,
	updatePassword,
	forgotPassword,
	resetPassword,
	verifyEmail,
	resendVerificationEmail,
	refreshToken
};
