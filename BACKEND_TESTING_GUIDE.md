# MommyCare Main Backend - Quick Start & Testing Guide

## 🚀 Quick Start

### 1. Setup & Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI (your MongoDB Atlas connection string)
# - JWT_SECRET (secure random string for token signing)
```

### 2. Environment Configuration
```env
# .env file
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB Atlas connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mommycare?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=30d
```

### 3. Start the Server
```bash
# Development with auto-reload
npm run dev

# Production mode
npm start
```

### 4. Verify Server is Running
```bash
# Check basic health
curl http://localhost:5000/health

# Check API health
curl http://localhost:5000/api/health
```

**Expected Health Response:**
```json
{
  "status": "success",
  "message": "MommyCare API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "uptime": 123.45,
  "memory": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 15728640
  },
  "database": "connected"
}
```

## 📊 API Testing Guide

### 1. Authentication Flow Testing

#### Test 1: User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
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
    "_id": "65a123456789abcdef",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "role": "mom"
  }
}
```

#### Test 2: User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@example.com",
    "password": "password123"
  }'
```

#### Test 3: Protected Route Access
```bash
# Save the token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Protected Route Response:**
```json
{
  "status": "success",
  "user": {
    "_id": "65a123456789abcdef",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "role": "mom",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Role-Based Registration Testing

#### Register Doctor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Dr. John",
    "lastName": "Smith",
    "email": "dr.smith@hospital.com",
    "password": "doctor123",
    "role": "doctor"
  }'
```

#### Register Midwife
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mary",
    "lastName": "Johnson",
    "email": "mary.midwife@health.com",
    "password": "midwife123",
    "role": "midwife"
  }'
```

#### Register Service Provider
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Baby",
    "lastName": "Store",
    "email": "contact@babystore.com",
    "password": "store123",
    "role": "service_provider"
  }'
```

### 3. Error Handling Testing

#### Test Invalid Registration
```bash
# Missing required fields
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "email": "invalid-email"
  }'
```

**Expected Error Response:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Last name is required",
      "param": "lastName",
      "location": "body"
    },
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password is required",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Test Duplicate Email Registration
```bash
# Try to register with existing email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Another",
    "lastName": "User",
    "email": "jane.doe@example.com",
    "password": "password123",
    "role": "mom"
  }'
```

**Expected Error Response:**
```json
{
  "status": "error",
  "message": "Email already in use"
}
```

#### Test Invalid Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Error Response:**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

#### Test Unauthorized Access
```bash
# Access protected route without token
curl -X GET http://localhost:5000/api/auth/me
```

**Expected Error Response:**
```json
{
  "status": "error",
  "message": "Access denied"
}
```

## 🧪 JavaScript/Frontend Integration Testing

### React/JavaScript Example
```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Registration Test
const testRegistration = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'mom'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Registration successful:', result.user);
      console.log('🔑 Token received:', result.token.substring(0, 20) + '...');
      
      // Store token for future requests
      localStorage.setItem('authToken', result.token);
      return result;
    } else {
      const error = await response.json();
      console.error('❌ Registration failed:', error.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};

// Login Test
const testLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Login successful:', result.user);
      console.log('🔑 Token received:', result.token.substring(0, 20) + '...');
      
      // Store token
      localStorage.setItem('authToken', result.token);
      return result;
    } else {
      const error = await response.json();
      console.error('❌ Login failed:', error.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};

// Protected Route Test
const testProtectedRoute = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('❌ No token found. Please login first.');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Protected route access successful:', result.user);
      return result;
    } else {
      const error = await response.json();
      console.error('❌ Protected route access failed:', error.message);
      
      if (response.status === 401) {
        console.log('🔄 Token may be expired. Please login again.');
        localStorage.removeItem('authToken');
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting MommyCare Backend API Tests');
  console.log('=' .repeat(50));

  // Test 1: Registration
  console.log('\n📝 Testing User Registration...');
  const registrationResult = await testRegistration();

  // Test 2: Login
  console.log('\n🔐 Testing User Login...');
  const loginResult = await testLogin();

  // Test 3: Protected Route
  console.log('\n🛡️ Testing Protected Route Access...');
  const protectedResult = await testProtectedRoute();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`Registration: ${registrationResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Login: ${loginResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Protected Route: ${protectedResult ? '✅ PASSED' : '❌ FAILED'}`);

  if (registrationResult && loginResult && protectedResult) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the backend logs.');
  }
};

// Execute tests
runAllTests();
```

## 🔧 Database Testing

### Check Database Connection
```bash
# Test database connectivity endpoint
curl http://localhost:5000/api/auth/test-db
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Database connection working",
  "userCount": 5
}
```

### MongoDB Atlas Troubleshooting
```bash
# If connection fails, check:
# 1. MongoDB URI format
# 2. Network access (IP whitelist)
# 3. Database user permissions
# 4. SSL/TLS configuration

# Test connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## 🌐 Real-Time Features Testing

### Socket.IO Connection Test
```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Test</title>
    <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
</head>
<body>
    <div id="messages"></div>
    <input id="messageInput" type="text" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>

    <script>
        // Connect to Socket.IO server
        const socket = io('http://localhost:5000');

        // Connection events
        socket.on('connect', () => {
            console.log('✅ Connected to server:', socket.id);
            document.getElementById('messages').innerHTML += 
                '<p>✅ Connected to server: ' + socket.id + '</p>';
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            document.getElementById('messages').innerHTML += 
                '<p>❌ Disconnected from server</p>';
        });

        // Join user room (replace with actual user ID)
        socket.emit('join', 'user123');

        // Listen for incoming messages
        socket.on('new_message', (data) => {
            console.log('📨 New message received:', data);
            document.getElementById('messages').innerHTML += 
                '<p>📨 ' + data.message + '</p>';
        });

        // Send message function
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value;
            
            if (message.trim()) {
                socket.emit('private_message', {
                    recipientId: 'user456', // Replace with target user
                    message: message,
                    senderId: 'user123'
                });
                
                document.getElementById('messages').innerHTML += 
                    '<p>📤 Sent: ' + message + '</p>';
                input.value = '';
            }
        }

        // Send message on Enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
```

## 🛠️ Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: Server Won't Start
**Symptoms:** `EADDRINUSE` or dependency errors

**Solution:**
```bash
# Check if port is in use
netstat -tulpn | grep :5000

# Kill process using port
npx kill-port 5000

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (requires 18+)
node --version
```

#### Issue 2: Database Connection Failed
**Symptoms:** "Database connection failed" errors

**Solution:**
```bash
# Verify environment variables
echo $MONGODB_URI
echo $JWT_SECRET

# Check MongoDB Atlas:
# 1. Network Access (IP whitelist)
# 2. Database Access (user permissions)  
# 3. Connection string format
# 4. SSL/TLS settings

# Test with different TLS options if using Node.js 22:
npm run dev:tls
```

#### Issue 3: CORS Errors
**Symptoms:** "Access to fetch blocked by CORS policy"

**Solution:**
```javascript
// Update CORS configuration in src/server.js
const allowedOrigins = [
  'http://localhost:5173',  // Your frontend port
  'http://localhost:3000',
  'http://localhost:5174',
  // Add your specific frontend URL
];
```

#### Issue 4: JWT Token Errors
**Symptoms:** "Invalid token" or "JWT secret not configured"

**Solution:**
```bash
# Generate a secure JWT secret (minimum 32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env file
JWT_SECRET=your-generated-secret-here
JWT_EXPIRE=30d

# Restart server after updating .env
npm run dev
```

#### Issue 5: Authentication Issues
**Symptoms:** 401 errors, "Access denied"

**Solution:**
```bash
# Check token format in requests
# Must be: "Authorization: Bearer <token>"

# Verify token hasn't expired
# Check JWT_EXPIRE setting in .env

# Test with fresh login token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📈 Performance Testing

### Load Testing with curl
```bash
# Test concurrent registrations
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"firstName\": \"User\",
      \"lastName\": \"$i\",
      \"email\": \"user$i@example.com\",
      \"password\": \"password123\",
      \"role\": \"mom\"
    }" &
done
wait
```

### Memory and Performance Monitoring
```bash
# Monitor server memory usage
curl http://localhost:5000/health | jq '.memory'

# Check server uptime
curl http://localhost:5000/health | jq '.uptime'

# Monitor database connection status
curl http://localhost:5000/api/auth/test-db
```

## 📝 Development Workflow

### 1. Create New API Endpoint
```bash
# 1. Create route file in src/routes/
# 2. Create controller in src/controllers/
# 3. Create model if needed in src/models/
# 4. Register route in src/server.js
# 5. Test endpoint with curl
# 6. Update documentation
```

### 2. Add New User Role
```bash
# 1. Update User model enum in src/models/User.js
# 2. Create role-specific profile model
# 3. Update registration controller
# 4. Create role-specific routes
# 5. Update frontend role handling
```

### 3. Database Schema Changes
```bash
# 1. Update model schema
# 2. Create migration script if needed
# 3. Test with sample data
# 4. Update API documentation
# 5. Update frontend data handling
```

This comprehensive testing guide should help you thoroughly test and integrate the MommyCare Main Backend!