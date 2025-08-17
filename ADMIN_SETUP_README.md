# MommyCare Admin System Setup

This document provides instructions for setting up and using the MommyCare admin system.

## Features

- **Admin Authentication**: Secure login system for administrators
- **User Management**: View, manage, and control all users in the system
- **Dashboard**: Real-time statistics and system overview
- **Role-based Access**: Different permission levels for different admin roles
- **User Status Control**: Activate/deactivate users as needed
- **Search and Filtering**: Advanced user search and filtering capabilities

## Working Admin Credentials

The system now has working admin credentials:

- **Primary Admin Account:**
  - **Email**: `newadmin@mommycare.com`
  - **Password**: `123456`
  - **Role**: `admin`

- **Backup Admin Account:**
  - **Email**: `testadmin@mommycare.com`
  - **Password**: `123456`
  - **Role**: `super_admin`

## Quick Start

1. **Navigate to Admin Login**: Go to `/admin/login` in your browser
2. **Use Quick Login**: Click the "Login as New Admin" button for instant access
3. **Or Enter Manually**: Use `newadmin@mommycare.com` / `123456`
4. **Access Dashboard**: You'll be redirected to `/admin/dashboard`

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `env.example` to `.env`
   - Configure your database connections and JWT secret

4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the root directory
   - Add: `VITE_API_URL=http://localhost:5000/api`

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Use the working credentials:
   - Email: `newadmin@mommycare.com`
   - Password: `123456`
3. Or click the "Login as New Admin" button for instant access
4. After successful login, you'll be redirected to `/admin/dashboard`

### Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard with statistics
- `/admin/users` - User management page
- `/admin/users/mothers` - Mothers management
- `/admin/users/providers` - Healthcare providers management
- `/admin/users/roles` - Role and permission management
- `/admin/settings` - Admin settings

### User Management Features

#### Viewing Users
- See all users with pagination
- Filter by role (mom, doctor, midwife, service_provider)
- Filter by status (active/inactive)
- Search by name, email, or location

#### Managing Users
- **Activate/Deactivate**: Toggle user account status
- **Delete**: Remove users from the system (with confirmation)
- **View Details**: See comprehensive user information

#### Statistics
- Total user count
- Active vs. inactive users
- Role distribution
- Recent registrations
- Engagement metrics

### Dashboard Features

- **Overview Cards**: Total users, active pregnancies, pending appointments, AI predictions
- **Quick Stats**: Weekly metrics and trends
- **Recent Activity**: Latest system activities
- **System Health**: Server status, database, AI models, security
- **Quick Actions**: Direct links to common admin tasks

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin profile
- `POST /api/admin/register` - Create new admin (for setup)

### User Management
- `GET /api/admin/users` - Get all users with pagination and filtering
- `GET /api/admin/users/stats` - Get user statistics
- `GET /api/admin/users/:id` - Get specific user details
- `PATCH /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Permission Management
- `GET /api/admin/permission-requests` - Get permission requests
- `PUT /api/admin/permission-request/:id/status` - Update request status
- `POST /api/admin/permission-request/:id/notes` - Add admin notes

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: All admin routes require valid authentication
- **Role-based Permissions**: Different access levels for different admin roles
- **Session Management**: Automatic logout on token expiration
- **Input Validation**: Server-side validation for all inputs

## Troubleshooting

### 401 Unauthorized Error

If you encounter a 401 error:

1. **Use the Working Credentials**: 
   - Email: `newadmin@mommycare.com`
   - Password: `123456`

2. **Quick Login**: Click the "Login as New Admin" button on the login page

3. **Check Backend**: Ensure the backend server is running on port 5000

4. **Verify API**: Test with: `curl http://localhost:5000/api/admin/test-db`

### Common Issues

1. **Database Connection Error**
   - Check your database configuration in `.env`
   - Ensure MongoDB is running
   - Verify connection strings

2. **Authentication Failed**
   - Use the working credentials: `newadmin@mommycare.com` / `123456`
   - Check if the backend server is running
   - Verify JWT secret in environment variables

3. **Frontend Not Loading**
   - Verify the backend server is running
   - Check `VITE_API_URL` in frontend `.env`
   - Check browser console for errors

4. **Users Not Loading**
   - Check admin token in localStorage
   - Verify API endpoint is accessible
   - Check backend logs for errors

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your backend `.env` file.

## Support

For additional support or questions:
1. Check the backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check database connectivity and permissions
5. Use the working credentials: `newadmin@mommycare.com` / `123456`

## Security Notes

- **Working Credentials**: The system now has verified working admin accounts
- **Environment Variables**: Never commit sensitive information to version control
- **Database Access**: Restrict database access to necessary users only
- **HTTPS**: Use HTTPS in production for secure communication
- **Regular Updates**: Keep dependencies updated for security patches

## Quick Access

**Ready to use admin account:**
- **URL**: `/admin/login`
- **Email**: `newadmin@mommycare.com`
- **Password**: `123456`
- **Quick Login**: Click "Login as New Admin" button
