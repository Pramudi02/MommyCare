# MommyCare Chat System

## Overview
The MommyCare Chat System provides real-time messaging functionality between users (moms) and healthcare providers (doctors and midwives). It includes features like file sharing, typing indicators, online status tracking, and message status updates.

## Features

### Core Chat Features
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **File Sharing**: Support for images and documents (PDF, Word, text)
- **Typing Indicators**: Show when someone is typing
- **Online Status**: Track user availability in real-time
- **Message Status**: Track sent, delivered, and read status
- **Unread Counts**: Maintain unread message counts per conversation
- **Search**: Find users to start conversations with

### Security Features
- JWT authentication for all endpoints
- File type validation and size limits
- XSS and SQL injection protection
- Rate limiting on all endpoints

## Architecture

### Models
- **Message**: Stores individual chat messages with metadata
- **Chat**: Manages conversations and participant relationships
- **User**: Extended with online status and last seen tracking

### Controllers
- **chatController**: Handles all chat-related business logic
- **File upload handling**: Secure file storage and validation

### Socket.IO Integration
- Real-time message delivery
- Typing indicators
- Online status updates
- Message status tracking

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Ensure your `.env` file contains:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### 3. Database Setup
The system will automatically create the necessary collections:
- `messages`: Chat messages
- `chats`: Conversation management
- `users`: User profiles with chat status

### 4. File Upload Directory
The system automatically creates:
- `uploads/chat/`: Directory for chat file uploads

### 5. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Chat Routes
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/conversations/:id/messages` - Get conversation messages
- `POST /api/chat/send` - Send a message
- `POST /api/chat/upload` - Upload a file
- `PATCH /api/chat/messages/:id/status` - Update message status
- `PATCH /api/chat/conversations/:id/read` - Mark conversation as read
- `DELETE /api/chat/messages/:id` - Delete a message
- `GET /api/chat/unread-count` - Get unread message count
- `GET /api/chat/search` - Search for users

### Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Socket.IO Events

### Client Events
- `join`: Join chat system
- `leave`: Leave chat system
- `join_conversation`: Join a specific conversation
- `typing_start/stop`: Typing indicators
- `message_delivered/read`: Message status updates

### Server Events
- `new_message`: New message received
- `typing_indicator`: User typing status
- `message_status_update`: Message status change
- `user_status_change`: User online/offline status

## Frontend Integration

### Connect to Socket.IO
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join when user logs in
socket.emit('join', userId);

// Listen for new messages
socket.on('new_message', handleNewMessage);
```

### Send Message
```javascript
const sendMessage = async (recipientId, content) => {
  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ recipientId, content, messageType: 'text' })
  });
  
  return response.json();
};
```

### Upload File
```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/chat/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  return response.json();
};
```

## File Upload Support

### Supported File Types
- **Images**: All image formats (JPEG, PNG, GIF, etc.)
- **Documents**: PDF, Word (.doc, .docx), Text files
- **Size Limit**: Maximum 10MB per file

### File Storage
- Files are stored in `uploads/chat/` directory
- Unique filenames generated to prevent conflicts
- File metadata stored in database

## Database Schema

### Message Schema
```javascript
{
  sender: ObjectId,           // Reference to User
  recipient: ObjectId,        // Reference to User
  content: String,            // Message content
  messageType: String,        // 'text', 'file', 'image'
  file: {                     // File metadata (if applicable)
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  status: String,             // 'sending', 'sent', 'delivered', 'read'
  read: Boolean,              // Read status
  readAt: Date,               // When message was read
  conversationId: String,     // Auto-generated conversation ID
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Schema
```javascript
{
  participants: [ObjectId],   // Array of User references
  conversationId: String,     // Unique conversation identifier
  lastMessage: {              // Last message in conversation
    content: String,
    sender: ObjectId,
    timestamp: Date,
    messageType: String
  },
  unreadCount: Map,           // Unread count per user
  isActive: Boolean,          // Conversation status
  startedAt: Date,            // When conversation started
  lastActivity: Date,         // Last activity timestamp
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Considerations

### Indexing
- Messages indexed by `conversationId` and `createdAt`
- Chats indexed by `participants` and `lastActivity`
- Users indexed by `isOnline` and `lastSeen`

### Caching
- Online users cached in memory for fast status checks
- Recent messages cached for quick access
- File metadata cached to reduce database queries

### Rate Limiting
- 100 requests per 15 minutes per IP
- File upload size limits enforced
- Concurrent connection limits

## Security Features

### Authentication & Authorization
- JWT-based authentication
- User-specific data access control
- Session management

### Input Validation
- File type validation
- File size limits
- Message content sanitization
- SQL injection prevention

### Data Protection
- XSS protection
- CORS configuration
- Rate limiting
- File upload restrictions

## Monitoring & Logging

### Logging
- All chat activities logged
- Error tracking and reporting
- Performance metrics collection

### Health Checks
- Database connection monitoring
- Socket.IO connection tracking
- File system health checks

## Troubleshooting

### Common Issues

#### Socket Connection Failed
- Check if server is running
- Verify CORS configuration
- Check network connectivity

#### File Upload Failed
- Verify file size (max 10MB)
- Check file type support
- Ensure upload directory exists

#### Messages Not Delivering
- Check user authentication
- Verify Socket.IO connection
- Check database connectivity

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=socket.io:*
```

## Development

### Adding New Features
1. Update models if needed
2. Add controller methods
3. Create/update routes
4. Add Socket.IO events
5. Update documentation

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment

### Production Considerations
- Use environment-specific configurations
- Enable compression and caching
- Set up proper logging
- Configure SSL/TLS
- Set up monitoring and alerts

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=production_mongodb_uri
JWT_SECRET=production_jwt_secret
FRONTEND_URL=https://yourdomain.com
PORT=5000
```

## Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Check database connectivity
4. Verify Socket.IO configuration

## License
MIT License - see LICENSE file for details
