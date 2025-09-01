const jwt = require('jsonwebtoken');

const getUserModel = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	console.log('🔐 Protect middleware - Token exists:', !!token);
	console.log('🔐 Protect middleware - Token value:', token ? token.substring(0, 20) + '...' : 'None');

	// Make sure token exists
	if (!token) {
		console.log('❌ No token provided');
		return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log('✅ Token verified, user ID:', decoded.id);

		// Get user from token
		const User = getUserModel();
		const user = await User.findById(decoded.id);

		if (!user) {
			console.log('❌ User not found for ID:', decoded.id);
			return res.status(401).json({ status: 'error', message: 'User not found' });
		}

		console.log('✅ User found:', user.email, 'Role:', user.role);
		req.user = user;
		next();
	} catch (error) {
		console.error('❌ Auth middleware error:', error);
		return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
	}
};

// Grant access to specific roles
const authorize = (...roles) => {
	return (req, res, next) => {
		console.log('🔐 Authorize middleware - User role:', req.user.role);
		console.log('🔐 Authorize middleware - Required roles:', roles);
		console.log('🔐 Authorize middleware - User has required role:', roles.includes(req.user.role));
		
		if (!roles.includes(req.user.role)) {
			console.log('❌ User role not authorized:', req.user.role, 'Required:', roles);
			return res.status(403).json({ 
				status: 'error', 
				message: `User role ${req.user.role} is not authorized to access this route` 
			});
		}
		console.log('✅ User authorized for role:', req.user.role);
		next();
	};
};

module.exports = {
	protect,
	authorize
};
