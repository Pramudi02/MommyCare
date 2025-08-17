const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple MongoDB connection
mongoose.connect(process.env.MONGODB_URI + 'Auth', {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB Auth database');
});

// Simple User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

// Simple ClinicVisitRequest Schema
const clinicVisitRequestSchema = new mongoose.Schema({
  mom: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestType: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true },
  notes: String,
  location: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const ClinicVisitRequest = mongoose.model('ClinicVisitRequest', clinicVisitRequestSchema);

// Simple JWT verification middleware
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
  }

  try {
    // For testing, we'll just decode the JWT to get the user ID
    // In production, you'd verify the signature
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Test server running' });
});

// Test clinic visit request endpoint
app.post('/api/mom/clinic-visit-requests', protect, async (req, res) => {
  try {
    const { requestType, preferredDate, preferredTime, notes, location } = req.body;
    
    if (!requestType || !preferredDate || !preferredTime || !location) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    const request = await ClinicVisitRequest.create({
      mom: req.user._id,
      requestType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      notes: notes || '',
      location,
      status: 'pending'
    });

    await request.populate('mom', 'firstName lastName email');

    res.status(201).json({
      status: 'success',
      message: 'Clinic visit request created successfully',
      data: request
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get clinic visit requests
app.get('/api/mom/clinic-visit-requests', protect, async (req, res) => {
  try {
    const requests = await ClinicVisitRequest.find({ mom: req.user._id })
      .sort({ createdAt: -1 })
      .populate('mom', 'firstName lastName email');

    res.json({
      status: 'success',
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

