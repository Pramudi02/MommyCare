# Clinic Visit Request System Setup Guide

## Overview
This system allows moms to request clinic visits through a user-friendly interface. The requests are stored in MongoDB and can be managed by administrators.

## Backend Setup

### 1. Environment Configuration
Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mommycare

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system. You can use:
- Local MongoDB installation
- MongoDB Atlas (cloud)
- Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

The server will start on port 5000.

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Frontend
```bash
npm run dev
```

The frontend will start on port 5173.

## Features Implemented

### Backend
- ✅ ClinicVisitRequest MongoDB model
- ✅ RESTful API endpoints for CRUD operations
- ✅ Authentication middleware integration
- ✅ Input validation and error handling
- ✅ MongoDB connection with proper error handling

### Frontend
- ✅ Clinic visit request modal form
- ✅ Request list display with status indicators
- ✅ Integration with backend API
- ✅ Form validation and error handling
- ✅ Responsive design with Tailwind CSS

## API Endpoints

### Clinic Visit Requests
- `POST /api/mom/clinic-visit-requests` - Create new request
- `GET /api/mom/clinic-visit-requests` - Get all requests for current mom
- `GET /api/mom/clinic-visit-requests/:id` - Get specific request
- `PUT /api/mom/clinic-visit-requests/:id` - Update request
- `PATCH /api/mom/clinic-visit-requests/:id/cancel` - Cancel request

## Database Schema

### ClinicVisitRequest Model
```javascript
{
  mom: ObjectId (ref: User),
  requestType: String (enum),
  preferredDate: Date,
  preferredTime: String (enum),
  notes: String,
  location: String,
  status: String (enum: pending, approved, rejected, completed, cancelled),
  midwife: ObjectId (ref: User),
  adminNotes: String,
  appointmentDate: Date,
  appointmentTime: String,
  timestamps: true
}
```

## Usage

1. **Create Request**: Click "Request Clinic Visit" button
2. **Fill Form**: Select request type, date, time, location, and add notes
3. **Submit**: Form validates and sends request to backend
4. **View Requests**: See all your requests below the form
5. **Cancel Request**: Cancel pending requests if needed

## Status Flow
- **Pending**: New request submitted
- **Approved**: Admin approved the request
- **Rejected**: Admin rejected the request
- **Completed**: Visit completed
- **Cancelled**: Request cancelled by mom

## Next Steps for Enhancement
1. Add admin panel for managing requests
2. Implement email/SMS notifications
3. Add file upload for medical documents
4. Integrate with calendar systems
5. Add payment processing for paid services
