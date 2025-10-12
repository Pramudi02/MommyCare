# MommyCare Main Backend Architecture & Flow Guide

## Overview
The MommyCare Main Backend is a Node.js/Express.js application that serves as the core API for the MommyCare platform. It handles user authentication, role-based access control, real-time messaging, appointments, and all business logic for mothers, doctors, midwives, and service providers.

## System Architecture

```
Frontend (React)
        ↓ HTTP/WebSocket
Main Backend (Express.js + Socket.IO)
        ↓
[Authentication] → [Role-Based Routes] → [Real-time Chat] → [Database]
        ↓                    ↓                ↓
   [JWT Auth]        [Multi-Role APIs]    [Socket.IO]
        ↓                    ↓                ↓
   [MongoDB]         [Business Logic]    [Live Updates]
```

## Directory Structure & File Responsibilities

### Root Files
```
backend/
├── server.js                 # Simple fallback server for Railway
├── package.json              # Dependencies and npm scripts
├── .env                      # Environment variables
├── .env.example              # Environment template
└── README.md                 # Project documentation
```

### Main Application Structure
```
src/
├── server.js                 # Main Express server & startup
├── config/
│   ├── database.js           # MongoDB connection & configuration
│   └── swagger.js            # API documentation setup
├── controllers/
│   └── authController.js     # Authentication business logic
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── errorHandler.js       # Global error handling
├── models/
│   ├── User.js               # User model (Auth database)
│   ├── Appointment.js        # Appointment model
│   ├── Message.js            # Message model
│   └── (other models...)
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── mom.js                # Mother-specific routes
│   ├── doctor.js             # Doctor-specific routes
│   ├── midwife.js            # Midwife-specific routes
│   ├── serviceProvider.js    # Service provider routes
│   ├── appointments.js       # Appointment management
│   ├── messages.js           # Message handling
│   ├── chat.js               # Real-time chat
│   └── (other route files...)
├── services/                 # Business logic services
└── socket/
    └── chatSocket.js         # Real-time chat functionality
```

## Data Flow: Step-by-Step Process

### 1. Application Startup Flow

```
1. src/server.js starts Express application
2. Load environment variables (.env file)
3. Initialize database connections (database.js)
4. Configure security middleware (CORS, Helmet, Rate Limiting)
5. Setup body parsing and compression
6. Initialize Socket.IO for real-time features
7. Register API routes with role-based protection
8. Setup error handling middleware
9. Start HTTP server on port 5000 (or PORT env var)
10. Server ready to accept requests
```

**File: `src/server.js` - Server Initialization**
```javascript
const startServer = async () => {
  try {
    await connectDB();  // Connect to MongoDB
    console.log('✅ All database connections established');
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MommyCare Backend Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};
```

### 2. Database Connection Flow (`src/config/database.js`)

```
1. Load MONGODB_URI from environment variables
2. Validate JWT_SECRET is configured
3. Setup enhanced connection options for MongoDB Atlas:
   ├── SSL/TLS configuration for Node.js compatibility
   ├── Connection pooling (maxPoolSize: 10)
   ├── Timeout configurations
   └── Retry and write concern settings
4. Establish connection using mongoose.connect()
5. Setup connection event handlers:
   ├── error: Log connection errors
   ├── disconnected: Log disconnection
   ├── reconnected: Log reconnection
   └── SIGINT: Graceful shutdown
6. Connection ready for model operations
```

**Connection Configuration:**
```javascript
const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
};
```

### 3. Authentication Flow

#### User Registration (`POST /api/auth/register`)

```
Frontend Request:
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123",
  "role": "mom"
}
```

**Step-by-Step Processing:**

1. **Route Handler** (`src/routes/auth.js`):
   ```javascript
   // Validation middleware
   const validateRegistration = [
     body('firstName').trim().isLength({ min: 2, max: 50 }),
     body('lastName').trim().isLength({ min: 2, max: 50 }),
     body('email').isEmail().normalizeEmail(),
     body('password').isLength({ min: 6 }),
     body('role').isIn(['mom', 'doctor', 'midwife', 'service_provider'])
   ];
   
   router.post('/register', validateRegistration, handleValidationErrors, register);
   ```

2. **Input Validation**:
   ```javascript
   // Express-validator checks:
   - firstName: 2-50 characters, trimmed
   - lastName: 2-50 characters, trimmed  
   - email: Valid email format, normalized
   - password: Minimum 6 characters
   - role: Must be one of valid roles
   ```

3. **Controller Logic** (`src/controllers/authController.js`):
   ```javascript
   const register = async (req, res) => {
     // 1. Validate required fields
     if (!firstName || !lastName || !email || !password || !role) {
       return res.status(400).json({ message: 'Missing required fields' });
     }
     
     // 2. Check if user already exists
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(400).json({ message: 'Email already in use' });
     }
     
     // 3. Create new user (password hashed in pre-save middleware)
     const user = await User.create({ firstName, lastName, email, password, role });
     
     // 4. Generate JWT token
     const token = user.getSignedJwtToken();
     
     // 5. Return success response
     return res.status(201).json({ status: 'success', token, user });
   };
   ```

4. **Password Hashing** (`src/models/User.js`):
   ```javascript
   // Pre-save middleware automatically hashes password
   userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) return next();
     
     const salt = await bcrypt.genSalt(12);
     this.password = await bcrypt.hash(this.password, salt);
     next();
   });
   ```

5. **Special Role Processing**:
   ```javascript
   // If user is a midwife, create additional profile
   if (role === 'midwife') {
     const MidwifeProfile = getMidwifeProfileModel();
     await MidwifeProfile.create({
       user: user._id,
       firstName: user.firstName,
       lastName: user.lastName,
       email: user.email,
       // Additional midwife-specific fields...
     });
   }
   ```

6. **JWT Token Generation**:
   ```javascript
   userSchema.methods.getSignedJwtToken = function() {
     return jwt.sign(
       { 
         id: this._id,
         role: this.role,
         email: this.email
       },
       process.env.JWT_SECRET,
       { expiresIn: process.env.JWT_EXPIRE || '30d' }
     );
   };
   ```

#### User Login (`POST /api/auth/login`)

```
Frontend Request:
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Step-by-Step Processing:**

1. **Input Validation**:
   ```javascript
   const validateLogin = [
     body('email').isEmail().normalizeEmail(),
     body('password').notEmpty()
   ];
   ```

2. **User Lookup & Password Verification**:
   ```javascript
   const login = async (req, res) => {
     // 1. Find user by email (include password field)
     const user = await User.findOne({ email }).select('+password');
     if (!user) {
       return res.status(401).json({ message: 'Invalid credentials' });
     }
     
     // 2. Verify password using bcrypt
     const isMatch = await user.matchPassword(password);
     if (!isMatch) {
       return res.status(401).json({ message: 'Invalid credentials' });
     }
     
     // 3. Generate and return JWT token
     const token = user.getSignedJwtToken();
     return res.status(200).json({ status: 'success', token, user });
   };
   ```

3. **Password Comparison**:
   ```javascript
   userSchema.methods.matchPassword = async function(enteredPassword) {
     return await bcrypt.compare(enteredPassword, this.password);
   };
   ```

### 4. Protected Route Access Flow

#### JWT Authentication Middleware (`src/middleware/auth.js`)

```
1. Extract token from Authorization header
2. Verify token using JWT_SECRET
3. Decode user information from token payload
4. Attach user data to request object
5. Call next() to continue to protected route
```

**Middleware Implementation:**
```javascript
const protect = async (req, res, next) => {
  let token;
  
  // Extract token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const User = getUserModel();
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### Role-Based Route Protection

```
// All role-specific routes require authentication
app.use('/api/mom', protect, momRoutes);
app.use('/api/doctor', protect, doctorRoutes);
app.use('/api/midwife', protect, midwifeRoutes);
app.use('/api/service-provider', protect, serviceProviderRoutes);
```

### 5. API Route Structure

| Route Group | Base Path | Protection | Purpose |
|-------------|-----------|------------|---------|
| **Authentication** | `/api/auth/*` | Public/Private | User registration, login, profile |
| **Mom Routes** | `/api/mom/*` | Protected | Pregnancy tracking, appointments |
| **Doctor Routes** | `/api/doctor/*` | Protected | Patient management, consultations |
| **Midwife Routes** | `/api/midwife/*` | Protected | Home visits, care tracking |
| **Service Provider** | `/api/service-provider/*` | Protected | Product sales, orders |
| **Appointments** | `/api/appointments/*` | Protected | Appointment scheduling |
| **Messages** | `/api/messages/*` | Protected | Direct messaging |
| **Chat** | `/api/chat/*` | Protected | Real-time chat rooms |

### 6. Real-Time Communication (Socket.IO)

#### Socket Connection Flow
```
1. Client establishes WebSocket connection
2. Server validates connection and assigns socket ID
3. User joins personal room for private messages
4. Setup event handlers for:
   ├── 'join': Join user-specific rooms
   ├── 'private_message': Send direct messages
   ├── 'appointment_update': Real-time appointment updates
   └── 'disconnect': Handle disconnection
```

**Socket Implementation:**
```javascript
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
});
```

### 7. Database Models & Relationships

#### User Model (`src/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { 
    type: String, 
    enum: ['mom', 'doctor', 'midwife', 'service_provider'],
    required: true 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
```

#### Model Connection Pattern
```javascript
// Each model uses a factory function to get the correct database connection
const getUserModel = () => {
  if (!User) {
    const { getAuthConnection } = require('../config/database');
    const authConnection = getAuthConnection();
    User = authConnection.model('User', userSchema);
  }
  return User;
};
```

### 8. Security Implementation

#### Security Middleware Stack
```javascript
// 1. Helmet - Security headers
app.use(helmet());

// 2. CORS - Cross-origin requests
app.use(cors({
  origin: ['http://localhost:5173', 'https://mommy-care.vercel.app'],
  credentials: true
}));

// 3. Rate Limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// 4. Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
```

#### Password Security
```javascript
// Strong password hashing with bcrypt
const salt = await bcrypt.genSalt(12); // High cost factor
this.password = await bcrypt.hash(this.password, salt);
```

#### JWT Security
```javascript
// JWT token with role-based claims
const token = jwt.sign(
  { id: this._id, role: this.role, email: this.email },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
);
```

### 9. Error Handling

#### Global Error Handler (`src/middleware/errorHandler.js`)
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Server Error'
  });
};
```

### 10. Environment Configuration

#### Required Environment Variables (`.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration  
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
```

#### Environment Validation
```javascript
// Validate critical environment variables on startup
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

## API Testing Examples

### 1. Health Check
```bash
# Basic health check
curl http://localhost:5000/health

# Enhanced health check 
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "MommyCare API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "uptime": 123.45,
  "memory": {...},
  "database": "connected"
}
```

### 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com", 
    "password": "password123",
    "role": "mom"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a123456789",
    "firstName": "Jane",
    "lastName": "Doe", 
    "email": "jane@example.com",
    "role": "mom"
  }
}
```

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### 4. Protected Route Access
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Performance & Monitoring

### Performance Features
- **Connection Pooling**: MongoDB connection pool (maxPoolSize: 10)
- **Compression**: Gzip compression for responses
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Request Size Limits**: 10MB maximum body size
- **Static File Serving**: Efficient static file handling

### Monitoring Points
- **Health Endpoints**: `/health` and `/api/health`
- **Database Connection**: Real-time connection status
- **Memory Usage**: Process memory monitoring
- **Uptime Tracking**: Server uptime statistics
- **Error Logging**: Comprehensive error logging

### Production Considerations
1. **Environment Variables**: All secrets in environment variables
2. **Database Security**: TLS/SSL enabled for MongoDB connections
3. **CORS Configuration**: Restricted to specific frontend domains
4. **Rate Limiting**: Prevents API abuse
5. **Input Validation**: Comprehensive input sanitization
6. **Error Handling**: User-friendly error responses
7. **Logging**: Structured logging for debugging

This architecture provides a robust, scalable, and secure backend foundation for the MommyCare platform with role-based access control, real-time features, and comprehensive error handling.