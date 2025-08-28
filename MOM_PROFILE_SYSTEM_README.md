# Mom Profile System - MommyCare

## Overview

The Mom Profile System is a comprehensive profile management solution for pregnant mothers in the MommyCare application. It allows moms to view and edit their detailed profile information including personal details, medical information, and healthcare provider details.

## Features

### ✅ Implemented Features

1. **Complete Profile Management**
   - Personal information (name, phone, age, blood group)
   - Physical measurements (height, weight, BMI)
   - Medical information (LMP, EDD, consultant obstetrician)
   - Location information (MOH area, PHM area, field clinic, etc.)
   - Emergency contact details
   - Medical history and current pregnancy information

2. **Backend API**
   - RESTful API endpoints for CRUD operations
   - Data validation and sanitization
   - Authentication and authorization
   - MongoDB database integration

3. **Frontend Interface**
   - Modern, responsive design
   - Form validation and error handling
   - Real-time feedback and loading states
   - Mobile-friendly interface

4. **Database Model**
   - Comprehensive schema with all required fields
   - Data validation and constraints
   - Automatic BMI calculation
   - Indexing for performance

## Database Schema

### MomProfile Model

```javascript
{
  user: ObjectId,                    // Reference to User model
  name: String,                      // Full name
  phone: String,                     // Phone number
  age: Number,                       // Age (13-100)
  bloodGroup: String,                // Blood group (A+, A-, B+, etc.)
  
  // Physical measurements
  height: {
    value: Number,                   // Height value
    unit: String                     // Unit (cm/ft)
  },
  weight: {
    value: Number,                   // Weight value
    unit: String                     // Unit (kg/lbs)
  },
  currentBMI: Number,                // Calculated BMI
  
  // Medical information
  lmp: Date,                         // Last Menstrual Period
  edd: Date,                         // Expected Due Date
  consultantObstetrician: String,    // Doctor name
  
  // Location information
  mohArea: String,                   // MOH Area
  phmArea: String,                   // PHM Area
  fieldClinic: String,               // Field Clinic
  gramaNiladhariDivision: String,    // GN Division
  hospitalClinic: String,            // Hospital Clinic
  nextClinicDate: Date,              // Next appointment
  
  // Additional information
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  medicalHistory: {
    allergies: [String],
    chronicConditions: [String],
    previousPregnancies: Number,
    complications: [String]
  },
  
  currentPregnancy: {
    week: Number,
    trimester: Number,
    isHighRisk: Boolean,
    riskFactors: [String]
  }
}
```

## API Endpoints

### GET /api/mom/profile
- **Description**: Get mom's profile information
- **Authentication**: Required (Bearer token)
- **Response**: Profile data with user details

### POST /api/mom/profile
- **Description**: Create or update mom's profile
- **Authentication**: Required (Bearer token)
- **Body**: Complete profile data
- **Response**: Created/updated profile

### PUT /api/mom/profile
- **Description**: Update mom's profile
- **Authentication**: Required (Bearer token)
- **Body**: Profile data to update
- **Response**: Updated profile

## Frontend Components

### Profile.jsx
- **Location**: `src/mom/pages/Profile.jsx`
- **Features**:
  - Form with all profile fields
  - Real-time validation
  - Loading states and error handling
  - Responsive design
  - Auto-save functionality

### Profile.css
- **Location**: `src/mom/pages/Profile.css`
- **Features**:
  - Modern UI design
  - Responsive layout
  - Dark mode support
  - Accessibility features

## Installation & Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Configure your environment variables
   ```

3. **Start Backend Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Configure VITE_API_URL in .env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Frontend Server**
   ```bash
   npm run dev
   ```

## Usage

### For Moms

1. **Access Profile**
   - Login to MommyCare
   - Click on profile dropdown in navbar
   - Select "Edit Profile"

2. **Fill Profile Information**
   - Complete all required fields (marked with *)
   - Add optional information as needed
   - Save changes

3. **View Profile**
   - Profile data is automatically loaded
   - All information is displayed in organized sections

### For Developers

1. **API Testing**
   ```bash
   # Run the test script
   node test-mom-profile.js
   ```

2. **Database Queries**
   ```javascript
   // Get mom profile
   const profile = await MomProfile.findOne({ user: userId });
   
   // Update profile
   const updated = await MomProfile.findByIdAndUpdate(id, data);
   ```

## File Structure

```
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── MomProfile.js          # Database model
│   │   └── routes/
│   │       └── mom.js                 # API endpoints
│   └── test-mom-profile.js            # API test script
├── src/
│   ├── mom/
│   │   └── pages/
│   │       ├── Profile.jsx            # Profile component
│   │       └── Profile.css            # Profile styles
│   └── services/
│       └── api.js                     # API service functions
└── MOM_PROFILE_SYSTEM_README.md       # This file
```

## Validation Rules

### Required Fields
- Name, Phone, Age, Blood Group
- Height, Weight, Current BMI
- LMP, EDD, Consultant Obstetrician
- All location fields (MOH, PHM, etc.)
- Next Clinic Date

### Data Validation
- Age: 13-100 years
- Height: 100-250 cm
- Weight: 30-200 kg
- BMI: 15-50
- Phone: Valid phone number format
- Dates: Valid date format

## Error Handling

### Backend Errors
- Validation errors with field-specific messages
- Authentication errors (401)
- Database connection errors
- Server errors (500)

### Frontend Errors
- Form validation errors
- API request failures
- Network connectivity issues
- Loading state management

## Security Features

1. **Authentication**
   - JWT token-based authentication
   - Protected routes and endpoints
   - Token validation middleware

2. **Data Validation**
   - Input sanitization
   - Schema validation
   - XSS protection

3. **Database Security**
   - MongoDB injection protection
   - Data encryption at rest
   - Secure connection strings

## Performance Optimizations

1. **Database**
   - Indexed fields for faster queries
   - Efficient schema design
   - Connection pooling

2. **Frontend**
   - Lazy loading of components
   - Optimized bundle size
   - Caching strategies

3. **API**
   - Response compression
   - Rate limiting
   - Caching headers

## Testing

### API Testing
```bash
# Run the test script
node test-mom-profile.js
```

### Manual Testing
1. Start both backend and frontend servers
2. Login as a mom user
3. Navigate to profile page
4. Test form validation and submission
5. Verify data persistence

## Troubleshooting

### Common Issues

1. **Profile Not Loading**
   - Check authentication token
   - Verify API endpoint is running
   - Check browser console for errors

2. **Form Validation Errors**
   - Ensure all required fields are filled
   - Check data format (dates, numbers)
   - Verify field constraints

3. **Save Failures**
   - Check network connectivity
   - Verify backend server is running
   - Check server logs for errors

### Debug Mode

Enable debug logging:
```javascript
// Backend
console.log('Profile data:', profile);

// Frontend
console.log('Form data:', formData);
```

## Future Enhancements

### Planned Features
1. **Profile Picture Upload**
   - Image upload functionality
   - Avatar management

2. **Document Upload**
   - Medical reports upload
   - Prescription management

3. **Profile Sharing**
   - Share profile with healthcare providers
   - Export profile data

4. **Advanced Analytics**
   - BMI tracking over time
   - Pregnancy progress visualization
   - Health trend analysis

### Technical Improvements
1. **Real-time Updates**
   - WebSocket integration
   - Live profile synchronization

2. **Offline Support**
   - Service worker implementation
   - Offline data storage

3. **Mobile App**
   - React Native implementation
   - Native mobile features

## Support

For technical support or questions:
- Check the troubleshooting section
- Review server logs
- Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.
