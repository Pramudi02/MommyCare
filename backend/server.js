const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

console.log('🚀 Starting MommyCare Server...');
console.log('📊 Port:', port);

// CORS middleware - allow frontend to connect
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:3000',
  'https://mommy-care.vercel.app',
  'https://mommy-care-git-main-pramudi02s-projects.vercel.app'
];

// Add any additional origins from environment variable
if (process.env.ADDITIONAL_CORS_ORIGINS) {
  allowedOrigins.push(...process.env.ADDITIONAL_CORS_ORIGINS.split(','));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get('/health', (req, res) => {
  console.log('✅ Health check requested at:', new Date().toISOString());
  res.status(200).json({
    status: 'success',
    message: 'MommyCare API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/health', (req, res) => {
  console.log('✅ API Health check requested at:', new Date().toISOString());
  res.status(200).json({
    status: 'success',
    message: 'MommyCare API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MommyCare Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      apiHealth: '/api/health',
      auth: '/api/auth/*',
      mom: '/api/mom/*',
      doctor: '/api/doctor/*',
      midwife: '/api/midwife/*'
    }
  });
});

// Basic API endpoints that frontend needs
app.get('/api/auth/me', (req, res) => {
  console.log('🔐 Auth me endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'Auth endpoint working',
    data: { 
      message: 'This is a placeholder endpoint',
      note: 'Connect to database for real user data'
    }
  });
});

app.get('/api/mom/clinic-visit-requests', (req, res) => {
  console.log('🏥 Clinic visit requests endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'Clinic visit requests endpoint working',
    data: []
  });
});

app.post('/api/mom/clinic-visit-requests', (req, res) => {
  console.log('🏥 Create clinic visit request called');
  res.status(201).json({
    status: 'success',
    message: 'Clinic visit request created (placeholder)',
    data: { id: 'temp-id', ...req.body }
  });
});

// Doctor endpoints
app.get('/api/doctor/appointments', (req, res) => {
  console.log('👨‍⚕️ Doctor appointments endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'Doctor appointments endpoint working',
    data: []
  });
});

// Midwife endpoints
app.get('/api/midwife/appointments', (req, res) => {
  console.log('👩‍⚕️ Midwife appointments endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'Midwife appointments endpoint working',
    data: []
  });
});

// Service provider endpoints
app.get('/api/service-provider/orders', (req, res) => {
  console.log('🛍️ Service provider orders endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'Service provider orders endpoint working',
    data: []
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/health',
      '/api/health',
      '/api/auth/me',
      '/api/mom/clinic-visit-requests',
      '/api/doctor/appointments',
      '/api/midwife/appointments',
      '/api/service-provider/orders'
    ]
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`🔗 API Health: http://localhost:${port}/api/health`);
  console.log('🌐 CORS enabled for frontend');
  console.log('🚀 Server is ready and responding!');
  console.log('📝 Available endpoints:');
  console.log('   - GET  /health');
  console.log('   - GET  /api/health');
  console.log('   - GET  /api/auth/me');
  console.log('   - GET  /api/mom/clinic-visit-requests');
  console.log('   - POST /api/mom/clinic-visit-requests');
  console.log('   - GET  /api/doctor/appointments');
  console.log('   - GET  /api/midwife/appointments');
  console.log('   - GET  /api/service-provider/orders');
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
