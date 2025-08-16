# MommyCare Backend API

A comprehensive backend API for MommyCare - a pregnancy and baby care platform with multi-database architecture.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Multi-database configuration
│   │   ├── initDatabase.js      # Database initialization
│   │   └── swagger.js           # API documentation config
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   ├── User.js              # User model (Auth database)
│   │   ├── Appointment.js       # Appointment model (MommyCareData database)
│   │   └── Message.js           # Message model (MommyCareData database)
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── doctor.js            # Doctor-specific routes
│   │   ├── midwife.js           # Midwife-specific routes
│   │   ├── mom.js               # Mom-specific routes
│   │   └── serviceProvider.js   # Service provider routes
│   ├── services/                # Business logic services
│   ├── utils/                   # Utility functions
│   └── server.js                # Main server file
├── public/                      # Static files
├── uploads/                     # File uploads
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🗄️ Multi-Database Architecture

### 1. **Auth Database** (`Auth`)
- **Purpose**: User authentication and profiles
- **Collections**: `users`
- **Data**: Registration, login, profiles, security tokens

### 2. **MommyCareData Database** (`MommyCareData`)
- **Purpose**: Main application data
- **Collections**: `appointments`, `messages`, `prescriptions`, `medicalrecords`
- **Data**: Appointments, messaging, medical records, payments

### 3. **Test Database** (`test`)
- **Purpose**: Development and testing
- **Collections**: Test versions of all collections
- **Data**: Development data, testing scenarios

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended for MongoDB Atlas compatibility)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MommyCare/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Update the .env file with your MongoDB Atlas credentials
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Role-Specific Routes
- `POST /api/doctor/permission-request` - Doctor permission request
- `POST /api/midwife/permission-request` - Midwife permission request
- `POST /api/service-provider/permission-request` - Service provider permission request

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## 🔐 Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Security Configuration
BCRYPT_ROUNDS=12
```

## 🛠️ Development

### Database Models

#### User Model (Auth Database)
```javascript
const getUserModel = require('../models/User');
const User = getUserModel(); // Uses Auth database automatically
```

#### Appointment Model (MommyCareData Database)
```javascript
const getAppointmentModel = require('../models/Appointment');
const Appointment = getAppointmentModel(); // Uses MommyCareData database
```

#### Message Model (MommyCareData Database)
```javascript
const getMessageModel = require('../models/Message');
const Message = getMessageModel(); // Uses MommyCareData database
```

### Adding New Models

1. Create the model file in `src/models/`
2. Use the appropriate database connection:
   - Auth database: `getAuthConnection()`
   - MommyCareData database: `getMommyCareDataConnection()`
   - Test database: `getTestConnection()`

### Cross-Database References

Since we use separate databases, you can't use Mongoose's `populate()` across databases. Instead:

```javascript
// Get appointment with user details
const appointment = await Appointment.findById(appointmentId);
const patient = await User.findById(appointment.patient); // From Auth database
const doctor = await User.findById(appointment.doctor); // From Auth database

// Combine the data
const appointmentWithUsers = {
  ...appointment.toObject(),
  patient: patient.toObject(),
  doctor: doctor.toObject()
};
```

## 🔍 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🚨 Troubleshooting

### SSL/TLS Issues with Node.js 22
If you encounter SSL errors with MongoDB Atlas and Node.js 22:

1. **Use Node.js 18** (recommended)
2. **Or use the provided scripts** that include TLS options
3. **Or add TLS options to your connection string**

### Database Connection Issues
1. Check your MongoDB Atlas IP whitelist
2. Verify your connection string
3. Ensure all environment variables are set

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please contact the MommyCare development team.
