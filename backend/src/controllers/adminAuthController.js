const getAdminUserModel = require('../models/AdminUser');
const jwt = require('jsonwebtoken');

// Helper function to create admin token response
const signAdminTokenResponse = (adminUser) => {
	const token = adminUser.getSignedJwtToken();
	return {
		token,
		admin: {
			_id: adminUser._id,
			username: adminUser.username,
			email: adminUser.email,
			role: adminUser.role,
			permissions: adminUser.permissions,
			isActive: adminUser.isActive
		}
	};
};

// @desc    Register admin user
// @route   POST /api/admin/register
// @access  Public (for initial setup, then should be protected)
const registerAdmin = async (req, res) => {
	try {
		console.log('Admin registration request received:', req.body);
		const { username, email, password, role, permissions } = req.body;

		// Validate required fields
		if (!username || !email || !password || !role) {
			console.log('Missing required fields:', { username, email, password, role });
			return res.status(400).json({ 
				status: 'error', 
				message: 'Missing required fields',
				required: ['username', 'email', 'password', 'role']
			});
		}

		// Check if admin user already exists
		const AdminUser = getAdminUserModel();
		console.log('Checking for existing admin user with email:', email);
		
		let existingAdmin;
		try {
			existingAdmin = await AdminUser.findOne({ 
				$or: [{ email }, { username }] 
			});
		} catch (dbError) {
			console.error('Database error checking existing admin user:', dbError);
			return res.status(503).json({ 
				status: 'error', 
				message: 'Database temporarily unavailable. Please try again in a moment.'
			});
		}
		
		if (existingAdmin) {
			console.log('Admin user already exists with email or username:', email, username);
			return res.status(400).json({ 
				status: 'error', 
				message: 'Email or username already in use' 
			});
		}

		console.log('Creating new admin user...');
		let adminUser;
		try {
			const adminData = { username, email, password, role };
			if (permissions && permissions.length > 0) {
				adminData.permissions = permissions;
			}
			
			adminUser = await AdminUser.create(adminData);
			console.log('Admin user created successfully:', adminUser._id);
		} catch (createError) {
			console.error('Error creating admin user:', createError);
			
			// Handle specific MongoDB errors
			if (createError.code === 11000) {
				return res.status(400).json({ 
					status: 'error', 
					message: 'Email or username already in use' 
				});
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
		
		const response = signAdminTokenResponse(adminUser);
		return res.status(201).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Admin registration error:', error);
		
		// Handle specific MongoDB errors
		if (error.code === 11000) {
			return res.status(400).json({ 
				status: 'error', 
				message: 'Email or username already in use' 
			});
		}
		
		if (error.name === 'ValidationError') {
			const validationErrors = Object.values(error.errors).map(err => err.message);
			return res.status(400).json({ 
				status: 'error', 
				message: 'Validation failed',
				errors: validationErrors
			});
		}
		
		return res.status(500).json({ status: 'error', message: 'Server error during admin registration' });
	}
};

// @desc    Login admin user
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate email and password
		if (!email || !password) {
			return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
		}

		// Check for admin user
		const AdminUser = getAdminUserModel();
		const adminUser = await AdminUser.findOne({ email }).select('+password');

		if (!adminUser) {
			return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
		}

		// Check if password matches
		const isMatch = await adminUser.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
		}

		// Check if admin account is active
		if (!adminUser.isActive) {
			return res.status(401).json({ status: 'error', message: 'Admin account is deactivated' });
		}

		const response = signAdminTokenResponse(adminUser);
		return res.status(200).json({ status: 'success', ...response });
	} catch (error) {
		console.error('Admin login error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error during admin login' });
	}
};

// @desc    Get current logged in admin user
// @route   GET /api/admin/me
// @access  Private
const getAdminMe = async (req, res) => {
	try {
		const AdminUser = getAdminUserModel();
		const adminUser = await AdminUser.findById(req.user.id);
		return res.status(200).json({ status: 'success', admin: adminUser });
	} catch (error) {
		console.error('Get admin me error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Log admin user out
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = async (req, res) => {
	try {
		return res.status(200).json({ status: 'success', message: 'Admin logged out successfully' });
	} catch (error) {
		console.error('Admin logout error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error during admin logout' });
	}
};

// @desc    Update admin user profile
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
	try {
		const { username, email, permissions } = req.body;
		const AdminUser = getAdminUserModel();
		
		const adminUser = await AdminUser.findByIdAndUpdate(
			req.user.id,
			{ username, email, permissions },
			{ new: true, runValidators: true }
		);

		return res.status(200).json({ status: 'success', admin: adminUser });
	} catch (error) {
		console.error('Update admin profile error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

// @desc    Update admin user password
// @route   PUT /api/admin/password
// @access  Private
const updateAdminPassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const AdminUser = getAdminUserModel();
		
		const adminUser = await AdminUser.findById(req.user.id).select('+password');
		
		// Check current password
		const isMatch = await adminUser.matchPassword(currentPassword);
		if (!isMatch) {
			return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
		}

		adminUser.password = newPassword;
		await adminUser.save();

		return res.status(200).json({ status: 'success', message: 'Admin password updated successfully' });
	} catch (error) {
		console.error('Update admin password error:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

module.exports = {
	registerAdmin,
	loginAdmin,
	getAdminMe,
	logoutAdmin,
	updateAdminProfile,
	updateAdminPassword
};
