# MommyCare Backend Server

## 🚀 Quick Start

### Option 1: Simple Development Server (Recommended for testing)
```bash
cd backend
npm start
# or
node server.js
```

### Option 2: Full Production Server (with database)
```bash
cd backend
npm run dev
# or
nodemon src/server.js
```

## 📁 Server Files Explained

### `server.js` (Root level - SIMPLE SERVER)
- **Purpose**: Simple development server for testing frontend connectivity
- **Features**: 
  - CORS enabled for frontend
  - Basic API endpoints (placeholder responses)
  - No database connection required
  - Perfect for frontend development and testing

### `src/server.js` (Full Production Server)
- **Purpose**: Complete production server with all features
- **Features**:
  - Database connections (MongoDB)
  - Authentication system
  - All API routes
  - Socket.io for real-time features
  - Swagger documentation
  - Rate limiting and security

## 🔗 Available Endpoints (Simple Server)

### Health Checks
- `GET /health` - Basic health check
- `GET /api/health` - API health check

### Authentication
- `GET /api/auth/me` - Get current user (placeholder)

### Mom Features
- `GET /api/mom/clinic-visit-requests` - Get clinic requests (placeholder)
- `POST /api/mom/clinic-visit-requests` - Create clinic request (placeholder)

### Doctor Features
- `GET /api/doctor/appointments` - Get appointments (placeholder)

### Midwife Features
- `GET /api/midwife/appointments` - Get appointments (placeholder)

### Service Provider Features
- `GET /api/service-provider/orders` - Get orders (placeholder)

## 🧪 Testing

### Test API Endpoints
```bash
cd backend
node test-fetch.js
```

### Test Frontend Connection
1. Start the server: `npm start`
2. Open your frontend (should be on port 5173)
3. Try to make API calls - they should now work!

## 🌐 CORS Configuration

The simple server allows connections from:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternative)
- `http://localhost:3000` (Create React App default)

## 🔧 Troubleshooting

### "fetch is not giving any response"
- ✅ **FIXED**: Added CORS middleware
- ✅ **FIXED**: Added proper API endpoints
- ✅ **FIXED**: Cleaned up multiple server files

### "Cannot find module"
- Make sure you're in the `backend` directory
- Run `npm install` if dependencies are missing

### Port already in use
- Change port in `server.js`: `const port = process.env.PORT || 5001;`
- Or kill existing process: `npx kill-port 5000`

## 📝 Next Steps

1. **For Development**: Use `server.js` (simple server)
2. **For Production**: Use `src/server.js` (full server)
3. **Add Database**: Connect MongoDB to get real data
4. **Add Authentication**: Implement JWT tokens
5. **Add Real Endpoints**: Replace placeholder responses with actual logic

## 🎯 Current Status

- ✅ **CORS Fixed**: Frontend can now connect
- ✅ **API Endpoints**: Basic endpoints working
- ✅ **Server Cleanup**: Removed duplicate files
- ✅ **Clear Structure**: One main server file
- 🔄 **Next**: Connect to database for real data
