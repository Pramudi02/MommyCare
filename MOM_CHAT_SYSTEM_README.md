# MommyCare Mom Chat System

## Overview

The MommyCare Mom Chat System provides a comprehensive real-time messaging interface for pregnant mothers to communicate with their assigned midwife and all available doctors on the platform. The system features role-based access, real-time messaging, file sharing, and a user-friendly interface.

## Features

### 🏥 Healthcare Provider Management
- **All Doctors**: View and chat with all available doctors on the platform
- **Assigned Midwife**: Dedicated chat with your assigned midwife (highlighted specially)
- **Role-based Filtering**: Filter between doctors, midwives, or view all providers
- **Provider Information**: View specialty, experience, availability, and ratings

### 💬 Chat Functionality
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **File Sharing**: Support for images, documents, and other file types
- **Message Status**: Track sent, delivered, and read status
- **Typing Indicators**: See when providers are typing
- **Message History**: Access to complete conversation history
- **Search & Filter**: Find specific providers or conversations

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with healthcare-focused styling
- **Provider Summary**: Quick overview of available doctors and assigned midwife
- **Visual Indicators**: Special styling for assigned midwife
- **Responsive Layout**: Works on desktop and mobile devices
- **Accessibility**: Clear visual hierarchy and intuitive navigation

## System Architecture

### Backend Components

#### Models
- **User**: Core user information and authentication
- **MomProfile**: Detailed mom profile information
- **MidwifeMom**: Relationship between moms and assigned midwives
- **Chat**: Conversation management
- **Message**: Individual message storage

#### Controllers
- **chatController**: Main chat logic and provider management
- **getAllHealthcareProviders**: Fetches doctors + assigned midwife for moms
- **getMidwifeChatUsers**: Fetches users for midwife chat interface

#### Routes
- `GET /api/chat/providers` - Get healthcare providers (doctors + assigned midwife)
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send messages
- `GET /api/chat/conversations/:id/messages` - Get conversation messages

### Frontend Components

#### Main Chat Interface
- **ChatBox**: Main chat component with sidebar and chat area
- **Provider List**: Shows all doctors and assigned midwife
- **Chat Area**: Message display and input
- **Filter Tabs**: Switch between All, Doctors, and My Midwife views

#### Key Features
- **Provider Summary**: Shows count of doctors and assigned midwife
- **Search Functionality**: Search providers by name or specialty
- **Role-based Filtering**: Filter by provider type
- **Assigned Midwife Highlighting**: Special styling for your midwife

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

3. **Database Models**
   Ensure the following models are properly set up:
   - User (with role field: 'mom', 'doctor', 'midwife')
   - MomProfile (linked to User)
   - MidwifeMom (relationship between moms and midwives)

4. **Start Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Chat**
   Navigate to `/mom/chat` or use the floating chat widget

## Usage Guide

### For Moms

1. **Access Chat**
   - Use the floating chat button on any mom page
   - Navigate directly to `/mom/chat`
   - Access from the main navigation menu

2. **View Providers**
   - **All Tab**: See all doctors and your assigned midwife
   - **Doctors Tab**: View only doctors
   - **My Midwife Tab**: View only your assigned midwife

3. **Start Conversations**
   - Click on any provider to start chatting
   - Your assigned midwife will be highlighted with special styling
   - Search for specific providers using the search bar

4. **Send Messages**
   - Type your message in the input field
   - Send text messages, images, or files
   - View message status (sent, delivered, read)

### Provider Management

#### Assigned Midwife
- Automatically loaded based on your profile
- Highlighted with special styling and "(Your Midwife)" label
- Accessible through the "MY MIDWIFE" filter tab

#### Doctors
- All available doctors on the platform
- Filtered by specialty and availability
- Accessible through the "Doctors" filter tab

## API Endpoints

### Get Healthcare Providers
```http
GET /api/chat/providers
Authorization: Bearer <jwt_token>
```

**Response for Moms:**
```json
{
  "success": true,
  "data": [
    {
      "id": "midwife_id",
      "name": "Dr. Sarah Johnson",
      "role": "midwife",
      "specialty": "Midwifery",
      "isMyMidwife": true,
      "isAssigned": true,
      "avatar": "avatar_url",
      "experience": "5+ years",
      "rating": 4.8
    },
    {
      "id": "doctor_id",
      "name": "Dr. Michael Chen",
      "role": "doctor",
      "specialty": "Cardiology",
      "isMyMidwife": false,
      "isAssigned": false,
      "avatar": "avatar_url",
      "experience": "12+ years",
      "rating": 4.8
    }
  ]
}
```

### Send Message
```http
POST /api/chat/messages
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipientId": "provider_id",
  "content": "Hello, I have a question about my pregnancy.",
  "messageType": "text"
}
```

## Testing

Use the provided test script to verify the system:

```bash
# Install axios if not already installed
npm install axios

# Run tests
node test-mom-chat.js
```

**Note:** Replace token placeholders with actual user tokens before running tests.

## Customization

### Styling
- Modify `src/mom/pages/chat.css` for visual changes
- Update color schemes, spacing, and layout
- Add new CSS classes for additional features

### Functionality
- Extend `chatController.js` for new features
- Add new API endpoints as needed
- Modify the frontend components for additional functionality

### Provider Types
- Add new provider roles in the User model
- Update the filtering logic in the frontend
- Extend the provider display components

## Troubleshooting

### Common Issues

1. **No Providers Loading**
   - Check database connection
   - Verify user authentication
   - Ensure proper user roles are set

2. **Assigned Midwife Not Showing**
   - Verify MomProfile exists
   - Check MidwifeMom relationship
   - Ensure midwife user is active

3. **Chat Not Working**
   - Check Socket.IO connection
   - Verify backend server is running
   - Check browser console for errors

### Debug Information

The system includes comprehensive logging:
- Backend: Check server console for API calls and errors
- Frontend: Check browser console for connection status and errors
- Network: Use browser dev tools to monitor API requests

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Users can only access appropriate data
- **Input Validation**: All user inputs are validated and sanitized
- **File Upload Security**: Secure file handling with type validation

## Performance Considerations

- **Database Indexing**: Optimized queries for provider lists
- **Real-time Updates**: Efficient Socket.IO implementation
- **Lazy Loading**: Messages loaded on demand
- **Caching**: Provider information cached for better performance

## Future Enhancements

- **Video Calls**: Integrate video calling functionality
- **Appointment Integration**: Link chats to appointments
- **Medical Records**: Secure sharing of medical documents
- **Notifications**: Push notifications for new messages
- **Analytics**: Chat usage and provider response metrics

## Support

For technical support or questions:
- Check the backend logs for error details
- Review the API documentation
- Test with the provided test scripts
- Verify database relationships and user roles

---

**Last Updated:** December 2024
**Version:** 1.0.0
**Maintainer:** MommyCare Development Team

