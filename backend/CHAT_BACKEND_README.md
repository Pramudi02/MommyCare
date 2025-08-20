# MommyCare Chat Backend Documentation

## Overview

The MommyCare chat backend provides a comprehensive real-time messaging system designed specifically for healthcare communication between mothers, doctors, midwives, and service providers. The system supports text messages, file sharing, voice/video calls, and real-time notifications.

## Features

### Core Chat Features
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **File Sharing**: Support for images, documents, audio, and video files
- **Message Status**: Track message delivery and read status
- **Conversation Management**: Create, manage, and organize conversations
- **User Status**: Real-time online/offline status tracking
- **Typing Indicators**: Show when users are typing
- **Message Reactions**: Add emoji reactions to messages
- **Message Editing**: Edit sent messages
- **Message Replies**: Reply to specific messages
- **Search**: Search conversations and users
- **Mute/Pin**: Mute or pin important conversations

### Healthcare-Specific Features
- **Role-based Access**: Different permissions for moms, doctors, midwives, and service providers
- **Specialty Filtering**: Filter healthcare providers by specialty
- **Availability Status**: Track provider availability
- **Rating System**: Provider ratings and reviews
- **Appointment Integration**: Link chats to appointments
- **Medical File Sharing**: Secure sharing of medical documents and images

### Real-time Communication
- **Voice Calls**: Initiate and manage voice calls
- **Video Calls**: High-quality video calling
- **Call Management**: Accept, reject, and end calls
- **Call History**: Track call duration and status

## Architecture

### Models

#### User Model
- Basic information (name, email, role)
- Profile details (avatar, specialty, experience)
- Online status and availability
- Preferences and settings
- Security features (password, verification)

#### Chat Model
- Conversation participants
- Last message information
- Unread message counts
- Chat settings (mute, pin)
- Metadata and appointment links

#### Message Model
- Message content and type
- Sender and recipient
- File attachments
- Message status and reactions
- Editing and reply information

### Controllers

#### ChatController
- `getUserConversations`: Get user's conversations
- `getConversationMessages`: Get messages in a conversation
- `sendMessage`: Send a new message
- `updateMessageStatus`: Update message status
- `markConversationAsRead`: Mark conversation as read
- `deleteMessage`: Delete a message
- `searchConversations`: Search for users and conversations
- `toggleChatMute`: Mute/unmute conversations
- `toggleChatPin`: Pin/unpin conversations
- `editMessage`: Edit sent messages
- `addMessageReaction`: Add reactions to messages
- `removeMessageReaction`: Remove message reactions

### Services

#### ChatService
Business logic layer that handles:
- Conversation creation and management
- Message processing and delivery
- User search and filtering
- Statistics and analytics
- File handling and validation

### Middleware

#### FileUpload Middleware
- Supports multiple file types (images, documents, audio, video)
- File size validation (up to 50MB)
- Secure file storage with organized directory structure
- File type filtering and validation
- Error handling and cleanup

### Socket Implementation

#### Real-time Features
- User connection management
- Message broadcasting
- Typing indicators
- Status updates
- Call management
- File transfer notifications

## API Endpoints

### Authentication
All chat endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Chat Routes

#### GET `/api/chat/conversations`
Get user's conversations with optional filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term for participant names/specialties
- `filter`: Filter by 'all', 'unread', or 'pinned'

#### GET `/api/chat/conversations/:conversationId/messages`
Get messages in a specific conversation.

**Query Parameters:**
- `limit`: Number of messages to return (default: 50)
- `skip`: Number of messages to skip (default: 0)

#### POST `/api/chat/send`
Send a new message.

**Request Body:**
```json
{
  "recipientId": "user_id",
  "content": "Message content",
  "messageType": "text|image|file|audio|video",
  "file": {
    "filename": "file.jpg",
    "path": "/uploads/chat/images/file.jpg",
    "size": 1024,
    "mimetype": "image/jpeg"
  },
  "replyTo": "message_id_to_reply_to"
}
```

#### POST `/api/chat/upload`
Upload a file for chat messaging.

**Form Data:**
- `file`: File to upload (max 50MB)

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP, SVG
- Audio: MP3, WAV, OGG, AAC, WebM
- Video: MP4, WebM, OGG, AVI, MOV, WMV
- Documents: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX

#### PATCH `/api/chat/messages/:messageId/status`
Update message status.

**Request Body:**
```json
{
  "status": "delivered|read"
}
```

#### PATCH `/api/chat/conversations/:conversationId/read`
Mark all messages in a conversation as read.

#### DELETE `/api/chat/messages/:messageId`
Delete a message (only sender can delete).

#### GET `/api/chat/unread-count`
Get total unread message count and count by conversation.

#### GET `/api/chat/search`
Search for users to start conversations with.

**Query Parameters:**
- `query`: Search term (required)
- `role`: Filter by user role (doctor, midwife, service_provider)

#### PATCH `/api/chat/conversations/:conversationId/mute`
Toggle conversation mute status.

#### PATCH `/api/chat/conversations/:conversationId/pin`
Toggle conversation pin status.

#### GET `/api/chat/conversations/:conversationId/participants`
Get all participants in a conversation.

#### PATCH `/api/chat/messages/:messageId/edit`
Edit a message.

**Request Body:**
```json
{
  "content": "New message content"
}
```

#### POST `/api/chat/messages/:messageId/reactions`
Add reaction to a message.

**Request Body:**
```json
{
  "emoji": "👍"
}
```

#### DELETE `/api/chat/messages/:messageId/reactions`
Remove reaction from a message.

**Request Body:**
```json
{
  "emoji": "👍"
}
```

## Socket Events

### Client to Server Events

#### Connection Management
- `join`: Join chat with user ID
- `leave`: Leave chat
- `join_conversation`: Join a specific conversation room
- `leave_conversation`: Leave a conversation room

#### Messaging
- `typing_start`: Start typing indicator
- `typing_stop`: Stop typing indicator
- `message_delivered`: Confirm message delivery
- `message_read`: Confirm message read

#### User Status
- `user_away`: Set user status to away
- `user_back`: Set user status to online
- `update_availability`: Update user availability

#### Message Management
- `message_reaction_added`: Add reaction to message
- `message_reaction_removed`: Remove reaction from message
- `message_edited`: Edit a message
- `message_deleted`: Delete a message

#### Chat Settings
- `chat_mute_toggled`: Toggle chat mute status
- `chat_pin_toggled`: Toggle chat pin status

#### Calling
- `voice_call_request`: Request voice call
- `video_call_request`: Request video call
- `call_accepted`: Accept incoming call
- `call_rejected`: Reject incoming call
- `call_ended`: End ongoing call

### Server to Client Events

#### Notifications
- `new_message`: New message received
- `message_status_update`: Message status changed
- `typing_indicator`: User typing status
- `user_status_change`: User online/offline status
- `user_availability_change`: User availability changed

#### Message Updates
- `message_reaction_updated`: Message reactions changed
- `message_edited`: Message was edited
- `message_deleted`: Message was deleted

#### Chat Updates
- `chat_mute_status_changed`: Chat mute status changed
- `chat_pin_status_changed`: Chat pin status changed

#### Call Management
- `incoming_voice_call`: Incoming voice call
- `incoming_video_call`: Incoming video call
- `call_accepted`: Call was accepted
- `call_rejected`: Call was rejected
- `call_ended`: Call ended

## File Storage

### Directory Structure
```
uploads/
├── chat/
│   ├── images/          # Image files
│   ├── files/           # Document files
│   ├── audio/           # Audio files
│   └── videos/          # Video files
```

### File Validation
- **Size Limit**: 50MB per file
- **File Count**: Up to 5 files per upload
- **Type Validation**: Strict MIME type checking
- **Security**: Sanitized filenames and secure storage paths

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- User session management
- Secure file uploads

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- File type validation

### Privacy
- End-to-end message encryption (planned)
- Secure file storage
- User data isolation
- Audit logging

## Performance Optimizations

### Database
- Indexed queries for fast retrieval
- Efficient pagination
- Optimized aggregation queries
- Connection pooling

### Caching
- User status caching
- Conversation metadata caching
- File metadata caching

### Real-time
- Efficient Socket.IO room management
- Optimized event broadcasting
- Connection pooling
- Rate limiting

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `413`: Payload Too Large
- `500`: Internal Server Error

### Error Response Format
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Monitoring & Logging

### Logging
- Request/response logging
- Error logging with stack traces
- Performance metrics
- User activity tracking

### Metrics
- Active connections count
- Message delivery rates
- File upload success rates
- API response times

## Deployment

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mommycare
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# File Upload
MAX_FILE_SIZE=52428800
MAX_FILES=5

# Socket
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### Dependencies
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "socket.io": "^4.6.0",
  "multer": "^1.4.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "helmet": "^6.0.0"
}
```

## Testing

### API Testing
- Unit tests for controllers and services
- Integration tests for API endpoints
- File upload testing
- Authentication testing

### Socket Testing
- Connection testing
- Event emission testing
- Real-time functionality testing
- Error handling testing

## Future Enhancements

### Planned Features
- End-to-end encryption
- Group chat functionality
- Message scheduling
- Advanced search and filtering
- Chat analytics dashboard
- Mobile push notifications
- Voice message transcription
- AI-powered chat assistance

### Scalability Improvements
- Redis caching layer
- Message queue system
- Microservices architecture
- Load balancing
- Database sharding

## Support

For technical support or questions about the chat backend:
- Check the API documentation at `/api-docs`
- Review the error logs
- Contact the development team
- Submit issues through the project repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.
