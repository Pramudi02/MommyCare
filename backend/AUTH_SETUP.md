# MommyCare Authentication System Setup

## 🎯 Simplified User Model

The User model now only contains the essential fields:
- **Role** (mom, doctor, midwife, service_provider)
- **First Name**
- **Last Name** 
- **Email Address**
- **Password**

## 🚀 Quick Start

### 1. Create Environment File
Create a `.env` file in the `backend` folder:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://your-username:your-password@mommycarecluster.noiaord.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

**Replace `your-username` and `your-password` with your actual MongoDB credentials.**

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Test the System
```bash
node test-auth-system.js
```

### 4. Start the Server
```bash
npm start
```

## 🔐 API Endpoints

### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "mom"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## 👥 Supported Roles

- **mom** - Mothers/Pregnant women
- **doctor** - Healthcare doctors
- **midwife** - Midwives
- **service_provider** - Service providers

## ✨ Features

- ✅ **No Admin Approval Required** - Users can login immediately after registration
- ✅ **Role-Based Access** - Users are redirected to their respective routes based on role
- ✅ **Secure Password Hashing** - Passwords are hashed with bcrypt
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Database Storage** - All users stored in Auth database as User collection

## 🗄️ Database Structure

- **Database**: `Auth`
- **Collection**: `User`
- **Fields**: firstName, lastName, email, password (hashed), role, timestamps

## 🔍 Testing

The system includes a comprehensive test script that:
- Creates test users for all roles
- Tests password verification
- Tests JWT token generation
- Tests user retrieval by role
- Cleans up test data

## 🚨 Important Notes

1. **No Admin Approval** - All users can access their routes immediately
2. **Simple Model** - Only essential fields are included
3. **Secure** - Passwords are properly hashed
4. **Role-Based** - Users are redirected based on their role after login

## 🎉 Ready to Use!

Your authentication system is now simplified and ready to use. Users can:
1. Register with any of the 4 roles
2. Login immediately with their credentials
3. Access their role-specific routes without admin approval
4. Navigate to their respective dashboards based on their role
