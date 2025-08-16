# 🚀 MommyCare Permission Request System

## 📋 Overview

The MommyCare Permission Request System is a comprehensive solution for managing permission requests from doctors, midwives, and service providers. It uses the **Admin database** to store all permission-related data, ensuring secure and organized management.

## 🗄️ Database Architecture

- **🔐 Auth Database**: User authentication and basic user profiles
- **👑 Admin Database**: Admin users, permission requests, and system configurations
- **🔧 Local Database**: Development logs and local data
- **🧪 Test Database**: Testing data and QA
- **⚙️ Config Database**: MongoDB system configuration

## 🎯 Supported User Roles

### 👨‍⚕️ Doctor
- **Fields**: specialization, licenseNumber, hospital, experience, education, certifications
- **Purpose**: Medical professionals seeking permission to provide healthcare services

### 👩‍⚕️ Midwife
- **Fields**: certificationNumber, clinic, experience, services
- **Purpose**: Midwifery professionals seeking permission to provide maternal care

### 🏢 Service Provider
- **Fields**: businessName, businessType, registrationNumber, businessServices
- **Purpose**: Healthcare businesses seeking permission to offer services

## 🌐 API Endpoints

### 👤 User Permission Requests

#### Submit Permission Request
```http
POST /api/permission-requests/:role/permission-request
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "specialization": "Cardiology",
  "licenseNumber": "MD123456",
  "hospital": "City General Hospital",
  "experience": 8,
  "education": ["MBBS", "MD Cardiology"],
  "certifications": ["Board Certified Cardiologist"],
  "additionalInfo": "Experienced cardiologist",
  "reason": "Seeking permission to provide cardiac care",
  "priority": "high",
  "isUrgent": false,
  "documents": [
    {
      "name": "Medical License",
      "url": "https://example.com/license.pdf",
      "type": "pdf"
    }
  ]
}
```

#### Get User's Permission Requests
```http
GET /api/permission-requests/:role/permission-requests
Authorization: Bearer <JWT_TOKEN>
```

#### Get Specific Permission Request
```http
GET /api/permission-requests/:role/permission-request/:requestId
Authorization: Bearer <JWT_TOKEN>
```

#### Update Permission Request
```http
PUT /api/permission-requests/:role/permission-request/:requestId
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "specialization": "Updated Cardiology",
  "experience": 10
}
```

#### Cancel Permission Request
```http
DELETE /api/permission-requests/:role/permission-request/:requestId
Authorization: Bearer <JWT_TOKEN>
```

### 👑 Admin Management

#### Get All Permission Requests
```http
GET /api/admin/permission-requests?status=pending&role=doctor&priority=high&page=1&limit=10
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### Get Permission Request Statistics
```http
GET /api/admin/permission-requests/stats
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### Get Specific Permission Request (Admin View)
```http
GET /api/admin/permission-request/:requestId
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### Update Permission Request Status
```http
PUT /api/admin/permission-request/:requestId/status
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "status": "approved",
  "adminNotes": "All documents verified. Permission granted."
}
```

#### Add Admin Note
```http
POST /api/admin/permission-request/:requestId/notes
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "note": "Additional verification required for license."
}
```

#### Bulk Update Permission Requests
```http
PUT /api/admin/permission-requests/bulk-update
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "requestIds": ["req1", "req2", "req3"],
  "status": "approved",
  "adminNotes": "Bulk approval for verified requests."
}
```

## 🔐 Authentication

### User Authentication
- Uses JWT tokens from the Auth database
- Protected routes require valid user token
- User ID extracted from token for request ownership

### Admin Authentication
- Separate admin JWT tokens with `isAdmin: true` flag
- Stored in Admin database
- Granular permissions system

## 📊 Request Statuses

- **⏳ pending**: Awaiting admin review
- **🔍 under_review**: Currently being reviewed
- **✅ approved**: Permission granted
- **❌ rejected**: Permission denied

## 🚨 Priority Levels

- **🔴 urgent**: Highest priority (requires immediate attention)
- **🟠 high**: High priority
- **🟡 medium**: Normal priority (default)
- **🟢 low**: Low priority

## 📝 Request Details Structure

### Doctor Request
```json
{
  "specialization": "String",
  "licenseNumber": "String",
  "hospital": "String",
  "experience": "Number",
  "education": ["Array of strings"],
  "certifications": ["Array of strings"],
  "additionalInfo": "String",
  "reason": "String"
}
```

### Midwife Request
```json
{
  "certificationNumber": "String",
  "clinic": "String",
  "experience": "Number",
  "services": ["Array of strings"],
  "additionalInfo": "String",
  "reason": "String"
}
```

### Service Provider Request
```json
{
  "businessName": "String",
  "businessType": "String",
  "registrationNumber": "String",
  "businessServices": ["Array of strings"],
  "additionalInfo": "String",
  "reason": "String"
}
```

## 🧪 Testing

### Test Permission Request System
```bash
cd backend
node test-permission-requests.js
```

### Test Complete System
```bash
cd backend
node test-complete-system.js
```

### Test Admin Authentication
```bash
cd backend
node test-admin-auth.js
```

## 🚀 Getting Started

### 1. Environment Setup
Ensure your `.env` file contains:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
npm start
# or
node src/server.js
```

### 4. Test System
```bash
node test-complete-system.js
```

## 🔧 Configuration

### Database Connections
The system automatically connects to all 5 databases:
- **Auth**: User authentication
- **Admin**: Admin users and permission requests
- **Local**: Development logs
- **Test**: Testing data
- **Config**: MongoDB configuration

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applied to all `/api/` routes

### CORS
- Configured for development and production origins
- Credentials enabled for authentication

## 📈 Features

- **🔐 Secure Authentication**: JWT-based user and admin authentication
- **📝 Comprehensive Request Management**: Full CRUD operations for permission requests
- **🔍 Advanced Filtering**: Filter by role, status, priority, and more
- **📊 Analytics**: Detailed statistics and reporting
- **🔄 Bulk Operations**: Process multiple requests simultaneously
- **📝 Admin Notes**: Track review process and decisions
- **🚨 Priority Management**: Handle urgent requests appropriately
- **⏰ Request Tracking**: Monitor request age and processing time
- **📄 Document Support**: Attach supporting documents to requests

## 🛠️ Development

### File Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── AdminUser.js          # Admin user model (Admin DB)
│   │   ├── PermissionRequest.js  # Permission request model (Admin DB)
│   │   └── User.js              # Regular user model (Auth DB)
│   ├── controllers/
│   │   ├── adminAuthController.js      # Admin authentication
│   │   ├── adminPermissionController.js # Admin permission management
│   │   └── permissionRequestController.js # User permission requests
│   ├── routes/
│   │   ├── admin.js             # Admin routes
│   │   └── permissionRequests.js # Permission request routes
│   └── config/
│       └── database.js          # Multi-database connections
├── test-admin-auth.js           # Admin system test
├── test-permission-requests.js  # Permission system test
└── test-complete-system.js      # Complete system test
```

### Adding New Fields
To add new fields to permission requests:

1. Update the schema in `PermissionRequest.js`
2. Add validation in `permissionRequests.js` routes
3. Update the controller logic in `permissionRequestController.js`
4. Update admin management in `adminPermissionController.js`
5. Test with the test scripts

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different user types
- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Secure cross-origin requests
- **Database Isolation**: Separate databases for different data types

## 📞 Support

For issues or questions:
1. Check the test scripts for examples
2. Verify database connections
3. Check JWT token validity
4. Review request validation rules
5. Check admin permissions

## 🎉 Success!

Your MommyCare Permission Request System is now fully functional with:
- ✅ Admin database integration
- ✅ Complete permission request workflow
- ✅ Admin management interface
- ✅ Multi-role support
- ✅ Advanced filtering and analytics
- ✅ Secure authentication
- ✅ Comprehensive testing

The system is ready for production use! 🚀
