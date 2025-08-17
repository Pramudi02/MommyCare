const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const momRoutes = require('./routes/mom');
const doctorRoutes = require('./routes/doctor');
const midwifeRoutes = require('./routes/midwife');
const serviceProviderRoutes = require('./routes/serviceProvider');
const appointmentRoutes = require('./routes/appointments');
const messageRoutes = require('./routes/messages');
const aiRoutes = require('./routes/ai');
const permissionRequestRoutes = require('./routes/permissionRequests');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');

// Import config
const { connectDB } = require('./config/database');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL_ALT || 'http://localhost:5174',
  // Allow Railway healthcheck
  'https://mommycare-production-f0d0.up.railway.app'
];

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log('🔌 Connecting to all databases...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    console.log('🌐 Port:', process.env.PORT || 5000);
    
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.error('💡 Please set MONGODB_URI in Railway environment variables');
      process.exit(1);
    }
    
    await connectDB();
    console.log('✅ All database connections established');
    
    const PORT = process.env.PORT || 5000;
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MommyCare Backend Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Railway health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log('✅ Server is ready to accept connections');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Railway healthcheck)
    if (!origin) return callback(null, true);
    
    // Allow Railway healthcheck
    if (origin.includes('railway.app')) return callback(null, true);
    
    // Allow allowed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    console.log('❌ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'MommyCare API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected' // We'll enhance this later
  });
});

// Enhanced health check for Railway
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'MommyCare API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MommyCare API Documentation'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mom', protect, momRoutes);
app.use('/api/doctor', protect, doctorRoutes);
app.use('/api/midwife', protect, midwifeRoutes);
app.use('/api/service-provider', protect, serviceProviderRoutes);
app.use('/api/appointments', protect, appointmentRoutes);
app.use('/api/messages', protect, messageRoutes);
app.use('/api/ai', protect, aiRoutes);
app.use('/api/permission-requests', permissionRequestRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle private messages
  socket.on('private_message', (data) => {
    io.to(`user_${data.recipientId}`).emit('new_message', data);
  });

  // Handle appointment updates
  socket.on('appointment_update', (data) => {
    io.to(`user_${data.userId}`).emit('appointment_updated', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Make io accessible to routes
app.set('io', io);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`⚠️ Unhandled Rejection: ${err.message}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

// Start the server
console.log('🚀 Starting MommyCare server...');
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = { app, server, io };
