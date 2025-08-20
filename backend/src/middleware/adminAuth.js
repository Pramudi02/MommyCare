const jwt = require('jsonwebtoken');
const getAdminUserModel = require('../models/AdminUser');

// Protect admin routes
const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Not authorized to access this route' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin user from token
    const AdminUser = getAdminUserModel();
    const adminUser = await AdminUser.findById(decoded.id);

    if (!adminUser) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Admin user not found' 
      });
    }

    if (!adminUser.isActive) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Admin account is deactivated' 
      });
    }

    // Add admin user to request object
    req.adminUser = adminUser;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      status: 'error', 
      message: 'Not authorized to access this route' 
    });
  }
};

// Grant access to specific admin roles
const authorizeAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.adminUser) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Admin user not authenticated' 
      });
    }
    
    if (!roles.includes(req.adminUser.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: `Admin role ${req.adminUser.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = {
  protectAdmin,
  authorizeAdmin
};
