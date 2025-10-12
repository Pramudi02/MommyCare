# MommyCare Main Backend - Visual Flow Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MommyCare Main Backend System                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   React App     │    │   Express.js    │    │   MongoDB       │          │
│  │   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │          │
│  │                 │    │                 │    │                 │          │
│  │ • Login/Register│    │ • JWT Auth      │    │ • Users         │          │
│  │ • Role Dashboard│    │ • Role Routes   │    │ • Appointments  │          │
│  │ • Chat/Messages │    │ • Socket.IO     │    │ • Messages      │          │
│  │ • Appointments  │    │ • API Endpoints │    │ • Profiles      │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
│           │                       │                       │                  │
│           │                       ▼                       │                  │
│           │              ┌─────────────────┐             │                  │
│           │              │  Socket.IO      │             │                  │
│           │              │  (Real-time)    │             │                  │
│           │              │                 │             │                  │
│           │              │ • Chat Rooms    │             │                  │
│           │              │ • Live Updates  │             │                  │
│           │              │ • Notifications │             │                  │
│           │              └─────────────────┘             │                  │
│           │                       │                       │                  │
│           └───────────────────────┼───────────────────────┘                  │
│                                   ▼                                          │
│                          ┌─────────────────┐                                │
│                          │  Role-Based     │                                │
│                          │  Access Control │                                │
│                          │                 │                                │
│                          │ • Mom Routes    │                                │
│                          │ • Doctor Routes │                                │
│                          │ • Midwife Routes│                                │
│                          │ • Service Routes│                                │
│                          └─────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Application Startup Flow

```
Start Application (src/server.js)
         │
         ▼
Load Environment Variables (.env)
         │
         ├─── NODE_ENV (development/production)
         ├─── PORT (default: 5000)
         ├─── MONGODB_URI (database connection)
         ├─── JWT_SECRET (token signing)
         └─── FRONTEND_URL (CORS configuration)
         │
         ▼
Initialize Express App
         │
         ▼
Configure Security Middleware
         │
         ├─── Helmet (Security headers)
         ├─── CORS (Cross-origin requests)
         ├─── Rate Limiting (100 req/15min per IP)
         └─── Body Parsing (JSON, 10MB limit)
         │
         ▼
Connect to Database (database.js)
         │
         ├─── Validate MONGODB_URI exists
         ├─── Setup connection options:
         │    ├─── SSL/TLS for Node.js compatibility
         │    ├─── Connection pooling (maxPoolSize: 10)
         │    ├─── Timeout configurations
         │    └─── Retry and write concern
         ├─── Connect using mongoose.connect()
         └─── Setup connection event handlers
         │
         ▼
Initialize Socket.IO Server
         │
         ├─── Create HTTP server
         ├─── Attach Socket.IO with CORS config
         └─── Setup chat socket handlers
         │
         ▼
Register API Routes
         │
         ├─── /api/auth (Public - Authentication)
         ├─── /api/mom (Protected - Mother routes)
         ├─── /api/doctor (Protected - Doctor routes)
         ├─── /api/midwife (Protected - Midwife routes)
         ├─── /api/service-provider (Protected)
         ├─── /api/appointments (Protected)
         ├─── /api/messages (Protected)
         └─── /api/chat (Protected)
         │
         ▼
Setup Error Handling & 404 Handler
         │
         ▼
Start HTTP Server
         │
         ├─── Listen on PORT (0.0.0.0)
         ├─── Log startup information
         └─── Ready to accept connections
         
Server Ready on Port 5000
```

## 3. User Registration Flow

```
Frontend Registration Form
       │
       ▼
POST /api/auth/register
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "mom"
}
       │
       ▼
Route Handler (routes/auth.js)
       │
       ├─── Express Validator Middleware:
       │    ├─── firstName: 2-50 chars, trimmed ✓
       │    ├─── lastName: 2-50 chars, trimmed ✓
       │    ├─── email: Valid format, normalized ✓
       │    ├─── password: Min 6 characters ✓
       │    └─── role: Valid enum value ✓
       │
       ├─── handleValidationErrors()
       │    └─── Return 400 if validation fails
       │
       └─── Call register controller
       │
       ▼
Controller Logic (controllers/authController.js)
       │
       ├─── Validate Required Fields
       │    └─── Return 400 if any field missing
       │
       ├─── Check Existing User
       │    ├─── User.findOne({ email })
       │    └─── Return 400 if email already exists
       │
       ├─── Create New User
       │    ├─── User.create({ firstName, lastName, email, password, role })
       │    └─── Password automatically hashed in pre-save middleware
       │
       ├─── Special Role Processing
       │    └─── IF role === 'midwife'
       │         └─── Create MidwifeProfile document
       │
       ├─── Generate JWT Token
       │    ├─── user.getSignedJwtToken()
       │    └─── Include: { id, role, email }
       │
       └─── Return Success Response
       │
       ▼
Password Hashing (models/User.js)
       │
       ├─── Pre-save middleware triggers
       ├─── Check if password modified
       ├─── Generate salt (cost: 12)
       ├─── Hash password with bcrypt
       └─── Save hashed password
       │
       ▼
Response to Frontend
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "65a123456789",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "role": "mom"
  }
}
```

## 4. User Login Flow

```
Frontend Login Form
       │
       ▼
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "password123"
}
       │
       ▼
Route Handler (routes/auth.js)
       │
       ├─── Express Validator Middleware:
       │    ├─── email: Valid format, normalized ✓
       │    └─── password: Not empty ✓
       │
       └─── Call login controller
       │
       ▼
Controller Logic (controllers/authController.js)
       │
       ├─── Validate Input
       │    └─── Return 400 if email or password missing
       │
       ├─── Check JWT Secret Configuration
       │    └─── Return 500 if JWT_SECRET not set
       │
       ├─── Find User by Email
       │    ├─── User.findOne({ email }).select('+password')
       │    └─── Return 401 if user not found
       │
       ├─── Verify Password
       │    ├─── user.matchPassword(password)
       │    ├─── Uses bcrypt.compare() internally
       │    └─── Return 401 if password doesn't match
       │
       ├─── Handle Legacy Password Migration
       │    ├─── Check if password looks hashed
       │    ├─── IF plaintext found, migrate to hashed
       │    └─── Update user.password and save
       │
       ├─── Generate JWT Token
       │    ├─── user.getSignedJwtToken()
       │    └─── Include: { id, role, email }
       │
       └─── Return Success Response
       │
       ▼
Password Verification (models/User.js)
       │
       ├─── matchPassword() method called
       ├─── bcrypt.compare(enteredPassword, hashedPassword)
       └─── Return boolean result
       │
       ▼
JWT Token Generation
       │
       ├─── Extract user data: { id, role, email }
       ├─── Sign with JWT_SECRET
       ├─── Set expiration (30 days default)
       └─── Return signed token
       │
       ▼
Response to Frontend
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "65a123456789",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "role": "mom"
  }
}
```

## 5. Protected Route Access Flow

```
Frontend API Request with Token
       │
       ▼
GET/POST /api/[protected-route]
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
       │
       ▼
Auth Middleware (middleware/auth.js)
       │
       ├─── Extract Token from Header
       │    ├─── Check "Authorization" header
       │    ├─── Verify "Bearer " prefix
       │    └─── Extract token string
       │
       ├─── Validate Token Presence
       │    └─── Return 401 if no token found
       │
       ├─── Verify JWT Token
       │    ├─── jwt.verify(token, JWT_SECRET)
       │    ├─── Decode payload: { id, role, email }
       │    └─── Return 401 if verification fails
       │
       ├─── Fetch User from Database
       │    ├─── User.findById(decoded.id)
       │    └─── Return 401 if user not found
       │
       ├─── Attach User to Request
       │    └─── req.user = user
       │
       └─── Call next() → Continue to route handler
       │
       ▼
Route Handler Processing
       │
       ├─── Access user data via req.user
       ├─── Check role-specific permissions if needed
       ├─── Execute business logic
       └─── Return response
       │
       ▼
Response to Frontend
{
  "status": "success",
  "data": { ... },
  "user": req.user
}
```

## 6. Real-Time Chat Flow (Socket.IO)

```
Frontend Chat Component
       │
       ▼
Initialize Socket Connection
       │
       ├─── const socket = io('http://localhost:5000')
       ├─── CORS validation on server
       └─── Connection established
       │
       ▼
Server Socket Handler (socket/chatSocket.js)
       │
       ├─── 'connection' event triggered
       ├─── Log new client: socket.id
       └─── Setup event listeners
       │
       ▼
User Joins Personal Room
       │
       ├─── Frontend emits: socket.emit('join', userId)
       ├─── Server: socket.join(`user_${userId}`)
       └─── User now in personal room for notifications
       │
       ▼
Send Private Message
       │
       ├─── Frontend emits: socket.emit('private_message', {
       │    recipientId: 'target_user_id',
       │    message: 'Hello!',
       │    senderId: 'current_user_id'
       │    })
       │
       ├─── Server receives message
       ├─── Validates message data
       ├─── Saves to database (Message model)
       └─── Forwards to recipient
       │
       ▼
Message Delivery
       │
       ├─── Server: io.to(`user_${recipientId}`).emit('new_message', data)
       ├─── Frontend listener: socket.on('new_message', (data) => {...})
       ├─── Update chat UI in real-time
       └─── Show notification if user not in chat
       │
       ▼
Appointment Updates
       │
       ├─── Doctor schedules appointment
       ├─── Server emits: io.to(`user_${patientId}`).emit('appointment_updated', {
       │    appointmentId: 'id',
       │    status: 'scheduled',
       │    datetime: '2024-01-15T10:00:00Z'
       │    })
       └─── Patient receives real-time notification
       │
       ▼
Connection Management
       │
       ├─── Handle disconnection: socket.on('disconnect')
       ├─── Log disconnected client
       ├─── Clean up rooms and listeners
       └─── Update user online status
```

## 7. Database Model Relationships

```
User Model (Central Authentication)
       │
       ├─── _id (ObjectId) - Primary key
       ├─── firstName, lastName (String)
       ├─── email (String, unique index)
       ├─── password (String, hashed, select: false)
       ├─── role (String, enum: ['mom', 'doctor', 'midwife', 'service_provider'])
       └─── timestamps (createdAt, updatedAt)
       │
       ▼
Role-Specific Profile Models
       │
       ├─── MomProfile
       │    ├─── user: ObjectId → User._id
       │    ├─── pregnancyDetails: {...}
       │    ├─── medicalHistory: {...}
       │    └─── babyInfo: {...}
       │
       ├─── DoctorProfile
       │    ├─── user: ObjectId → User._id
       │    ├─── specialization: String
       │    ├─── licenseNumber: String
       │    └─── hospital: String
       │
       ├─── MidwifeProfile
       │    ├─── user: ObjectId → User._id
       │    ├─── licenseNumber: String
       │    ├─── phmArea: String
       │    └─── experience: String
       │
       └─── ServiceProviderProfile
            ├─── user: ObjectId → User._id
            ├─── businessName: String
            ├─── serviceType: String
            └─── location: String
       │
       ▼
Appointment Model
       │
       ├─── patient: ObjectId → User._id (role: 'mom')
       ├─── provider: ObjectId → User._id (role: 'doctor'|'midwife')
       ├─── appointmentType: String
       ├─── scheduledDateTime: Date
       ├─── status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled'])
       └─── notes: String
       │
       ▼
Message Model
       │
       ├─── sender: ObjectId → User._id
       ├─── recipient: ObjectId → User._id
       ├─── content: String
       ├─── messageType: String (enum: ['text', 'image', 'document'])
       ├─── isRead: Boolean
       └─── timestamp: Date
       │
       ▼
Cross-Model Data Access Pattern
       │
       ├─── No Mongoose populate() across databases
       ├─── Manual data joining in controllers:
       │    
       │    // Get appointment with user details
       │    const appointment = await Appointment.findById(id);
       │    const patient = await User.findById(appointment.patient);
       │    const doctor = await User.findById(appointment.provider);
       │    
       │    // Combine data
       │    const fullAppointment = {
       │      ...appointment.toObject(),
       │      patient: patient.toObject(),
       │      doctor: doctor.toObject()
       │    };
       │
       └─── Cache frequently accessed data for performance
```

## 8. Error Handling Flow

```
API Request
     │
     ▼
Route Handler
     │
     ├─── Input Validation (Express Validator)
     │    └─── ValidationError → 400 response
     │
     ├─── Authentication Check (JWT Middleware)
     │    └─── AuthError → 401 response
     │
     ├─── Business Logic Processing
     │    ├─── Database Operations
     │    ├─── External API calls
     │    └─── File operations
     │
     └─── Error Scenarios:
           │
           ├─── Mongoose CastError (Invalid ObjectId)
           │    └─── Convert to: 404 "Resource not found"
           │
           ├─── Mongoose ValidationError
           │    └─── Convert to: 400 with validation messages
           │
           ├─── MongoDB Duplicate Key (Code: 11000)
           │    └─── Convert to: 400 "Duplicate field value"
           │
           ├─── JWT Errors
           │    ├─── TokenExpiredError → 401 "Token expired"
           │    ├─── JsonWebTokenError → 401 "Invalid token"
           │    └─── NotBeforeError → 401 "Token not active"
           │
           ├─── Custom Business Logic Errors
           │    └─── Convert to appropriate HTTP status
           │
           └─── Unexpected Errors
                └─── Convert to: 500 "Internal server error"
     │
     ▼
Global Error Handler (middleware/errorHandler.js)
     │
     ├─── Log error details for debugging
     ├─── Sanitize error message for production
     ├─── Set appropriate HTTP status code
     └─── Return standardized error response
     │
     ▼
Error Response Format
{
  "status": "error",
  "message": "User-friendly error message",
  "errors": [...] // For validation errors
}
```

## 9. Security Implementation Flow

```
Request Reception
     │
     ▼
Security Middleware Stack
     │
     ├─── Helmet Middleware
     │    ├─── Sets security headers
     │    ├─── Prevents XSS attacks
     │    ├─── Enforces HTTPS
     │    └─── Hides Express signature
     │
     ├─── CORS Middleware
     │    ├─── Validates origin against allowlist
     │    ├─── Handles preflight requests
     │    ├─── Sets Access-Control headers
     │    └─── Blocks unauthorized origins
     │
     ├─── Rate Limiting Middleware
     │    ├─── Tracks requests per IP
     │    ├─── 100 requests / 15 minutes limit
     │    ├─── Returns 429 if exceeded
     │    └─── Prevents brute force attacks
     │
     ├─── Body Parser Middleware
     │    ├─── Limits body size (10MB max)
     │    ├─── Validates JSON format
     │    ├─── Prevents buffer overflow
     │    └─── Sanitizes input data
     │
     └─── Compression Middleware
          ├─── Compresses response data
          ├─── Reduces bandwidth usage
          └─── Improves performance
     │
     ▼
Authentication & Authorization
     │
     ├─── JWT Token Validation
     │    ├─── Verify signature with JWT_SECRET
     │    ├─── Check token expiration
     │    ├─── Validate token structure
     │    └─── Extract user claims
     │
     ├─── User Authentication
     │    ├─── Fetch user from database
     │    ├─── Verify user is active
     │    ├─── Check account status
     │    └─── Attach user to request
     │
     └─── Role-Based Authorization
          ├─── Check user role permissions
          ├─── Validate resource access
          ├─── Enforce business rules
          └─── Allow/deny request
     │
     ▼
Data Protection
     │
     ├─── Password Security
     │    ├─── bcrypt hashing (cost: 12)
     │    ├─── Salt generation
     │    ├─── No plaintext storage
     │    └─── Secure comparison
     │
     ├─── Input Sanitization
     │    ├─── Express Validator rules
     │    ├─── XSS prevention
     │    ├─── SQL injection prevention
     │    └─── Data type validation
     │
     └─── Database Security
          ├─── TLS/SSL connections
          ├─── Connection string protection
          ├─── Query parameterization
          └─── Access control
```

This comprehensive visual documentation shows how the MommyCare Main Backend processes requests, handles authentication, manages real-time communication, and ensures security throughout the entire application flow.