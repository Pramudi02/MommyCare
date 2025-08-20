const getUserModel = require('../models/User');
const jwt = require('jsonwebtoken');

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
			role: user.role
		}
	};
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
	try {
		console.log('Registration request received:', req.body);
		const { firstName, lastName, email, password, role } = req.body;

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
			user = await User.create({ firstName, lastName, email, password, role });
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

		// Ensure JWT secret is configured
		if (!process.env.JWT_SECRET) {
			console.error('Login error: JWT_SECRET not configured');
			return res.status(500).json({ status: 'error', message: 'Server configuration error' });
		}

		// Check for user
		const User = getUserModel();
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
		}

		// Check if password matches, handle malformed legacy hashes
		let isMatch = false;
		try {
			isMatch = await user.matchPassword(password);
		} catch (cmpErr) {
			console.error('Password compare error:', cmpErr?.message);
			const looksHashed = typeof user.password === 'string' && user.password.startsWith('$2');
			if (!looksHashed && user.password === password) {
				// Migrate plaintext → hashed
				try {
					user.password = password; // triggers pre-save hashing
					await user.save();
					isMatch = true;
				} catch (rehashErr) {
					console.error('Password migration error:', rehashErr?.message);
					return res.status(500).json({ status: 'error', message: 'Server error during login' });
				}
			}
		}

		if (!isMatch) {
			return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
		}

		// Safe token generation
		let response;
		try {
			response = signTokenResponse(user);
		} catch (tokenErr) {
			console.error('Token generation error:', tokenErr?.message);
			return res.status(500).json({ status: 'error', message: 'Server error during login' });
		}
		return res.status(200).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Login error:', error?.message || error);
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

// @desc    Log user out
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
	try {
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
		const { firstName, lastName } = req.body;
		const User = getUserModel();
		
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ firstName, lastName },
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
		await user.save();

		return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
	} catch (error) {
		console.error('Update password error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

module.exports = {
	register,
	login,
	getMe,
	logout,
	updateProfile,
	updatePassword
};
