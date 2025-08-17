const jwt = require('jsonwebtoken');

const getUserModel = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	// Make sure token exists
	if (!token) {
		return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Get user from token
		const User = getUserModel();
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({ status: 'error', message: 'User not found' });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
	}
};

// Grant access to specific roles
const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ 
				status: 'error', 
				message: `User role ${req.user.role} is not authorized to access this route` 
			});
		}
		next();
	};
};

module.exports = {
	protect,
	authorize
};
