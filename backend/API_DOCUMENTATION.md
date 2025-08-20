# MommyCare API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "mom",
  "gender": "female"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "mom",
    "avatar": ""
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "user": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "mom",
    "momProfile": { ... }
  }
}
```

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1987654321"
}
```

### Update Password
**PUT** `/auth/password`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

**Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password/:resetToken`

**Body:**
```json
{
  "password": "newpassword123"
}
```

---

## Mom Endpoints

### Get Mom Profile
**GET** `/mom/profile`

**Headers:** `Authorization: Bearer <token>`

### Get Medical Records
**GET** `/mom/medical-records`

**Headers:** `Authorization: Bearer <token>`

### Get Appointments
**GET** `/mom/appointments`

**Headers:** `Authorization: Bearer <token>`

---

## Doctor Endpoints

### Get Doctor Dashboard
**GET** `/doctor/dashboard`

**Headers:** `Authorization: Bearer <token>`

### Get Patients
**GET** `/doctor/patients`

**Headers:** `Authorization: Bearer <token>`

### Get Appointments
**GET** `/doctor/appointments`

**Headers:** `Authorization: Bearer <token>`

---

## Service Provider Endpoints

### Get Service Provider Dashboard
**GET** `/service-provider/dashboard`

**Headers:** `Authorization: Bearer <token>`

### Get Products
**GET** `/service-provider/products`

**Headers:** `Authorization: Bearer <token>`

### Get Orders
**GET** `/service-provider/orders`

**Headers:** `Authorization: Bearer <token>`

---

## Appointment Endpoints

### Get My Appointments
**GET** `/appointments`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "appointment-id",
      "user": "user-id",
      "doctor": "doctor-id",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "status": "scheduled",
      "reason": "Prenatal checkup",
      "location": "online"
    }
  ]
}
```

### Create Appointment
**POST** `/appointments`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "doctor": "doctor-id",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "reason": "Prenatal checkup",
  "location": "online"
}
```

### Update Appointment
**PUT** `/appointments/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "completed",
  "notes": "Everything looks good"
}
```

### Delete Appointment
**DELETE** `/appointments/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Message Endpoints

### Get Conversation
**GET** `/messages/:otherUserId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "message-id",
      "sender": "user-id",
      "recipient": "other-user-id",
      "content": "Hello doctor!",
      "read": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Send Message
**POST** `/messages/send`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "recipient": "doctor-id",
  "content": "Hello doctor!"
}
```

### Mark Messages as Read
**POST** `/messages/read`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "otherUserId": "doctor-id"
}
```

---

## AI Endpoints

### AI Service Health Check
**GET** `/ai/health`

**Headers:** `Authorization: Bearer <token>`

### Baby Weight Prediction
**POST** `/ai/baby-weight`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "gestation_weeks": 38,
  "mother_age": 28,
  "mother_weight": 65,
  "mother_height": 165
}
```

### Gestational Diabetes Detection
**POST** `/ai/gestational-diabetes`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "age": 28,
  "bmi": 24.5,
  "family_history": true,
  "previous_gestational_diabetes": false
}
```

---

## Health Check

### Server Health
**GET** `/health`

**Response:**
```json
{
  "status": "success",
  "message": "MommyCare API is running",
  "timestamp": "2024-01-15T10:00:00Z",
  "environment": "development"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Socket.io Events

### Join User Room
```javascript
socket.emit('join', userId);
```

### Receive New Message
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

### Receive Appointment Update
```javascript
socket.on('appointment_updated', (data) => {
  console.log('Appointment update:', data);
});
```

---

## User Roles

- `mom` - Pregnant women using the platform
- `doctor` - Healthcare providers
- `service_provider` - Product/service providers
- `admin` - Platform administrators

---

## Chat API Endpoints

### Get User Conversations
**GET** `/chat/conversations`

Get all conversations for the authenticated user.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "chat_id",
      "conversationId": "user1_user2",
      "participant": {
        "_id": "user_id",
        "name": "Dr. Sarah Johnson",
        "email": "sarah@example.com",
        "role": "doctor",
        "avatar": "avatar_url",
        "specialty": "Cardiology"
      },
      "lastMessage": {
        "content": "How are you feeling today?",
        "sender": "user_id",
        "timestamp": "2024-01-15T10:30:00Z",
        "messageType": "text"
      },
      "unreadCount": 2,
      "lastActivity": "2024-01-15T10:30:00Z",
      "startedAt": "2024-01-10T09:00:00Z"
    }
  ]
}
```

### Get Conversation Messages
**GET** `/chat/conversations/:conversationId/messages`

Get all messages for a specific conversation.

**Parameters:**
- `conversationId` (string): The conversation identifier

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "message_id",
      "sender": {
        "_id": "user_id",
        "name": "Dr. Sarah Johnson",
        "avatar": "avatar_url",
        "role": "doctor",
        "specialty": "Cardiology"
      },
      "recipient": {
        "_id": "user_id",
        "name": "Jane Doe",
        "avatar": "avatar_url",
        "role": "mom"
      },
      "content": "Hello! How can I help you today?",
      "messageType": "text",
      "status": "read",
      "read": true,
      "readAt": "2024-01-15T10:35:00Z",
      "conversationId": "user1_user2",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

### Send Message
**POST** `/chat/send`

Send a new message to a recipient.

**Request Body:**
```json
{
  "recipientId": "recipient_user_id",
  "content": "Hello doctor, I have a question about my pregnancy.",
  "messageType": "text"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "message_id",
    "sender": "sender_user_id",
    "recipient": "recipient_user_id",
    "content": "Hello doctor, I have a question about my pregnancy.",
    "messageType": "text",
    "status": "sent",
    "conversationId": "user1_user2",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Upload File
**POST** `/chat/upload`

Upload a file (image or document) for chat.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` field containing the file

**Supported File Types:**
- Images: `image/*`
- Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`
- Maximum file size: 10MB

**Response:**
```json
{
  "status": "success",
  "data": {
    "filename": "chat-1705312200000-123456789.pdf",
    "originalName": "medical_report.pdf",
    "mimetype": "application/pdf",
    "size": 2048576,
    "path": "uploads/chat/chat-1705312200000-123456789.pdf"
  }
}
```

### Update Message Status
**PATCH** `/chat/messages/:messageId/status`

Update the status of a message (delivered, read).

**Parameters:**
- `messageId` (string): The message identifier

**Request Body:**
```json
{
  "status": "read"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "message_id",
    "status": "read",
    "readAt": "2024-01-15T10:35:00Z"
  }
}
```

### Mark Conversation as Read
**PATCH** `/chat/conversations/:conversationId/read`

Mark all messages in a conversation as read.

**Parameters:**
- `conversationId` (string): The conversation identifier

**Response:**
```json
{
  "status": "success",
  "message": "Conversation marked as read"
}
```

### Delete Message
**DELETE** `/chat/messages/:messageId`

Delete a message (only sender can delete).

**Parameters:**
- `messageId` (string): The message identifier

**Response:**
```json
{
  "status": "success",
  "message": "Message deleted successfully"
}
```

### Get Unread Count
**GET** `/chat/unread-count`

Get the total unread message count and count by conversation.

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalUnread": 5,
    "unreadByConversation": {
      "user1_user2": 2,
      "user1_user3": 3
    }
  }
}
```

### Search Conversations
**GET** `/chat/search?query=search_term`

Search for users to start conversations with.

**Query Parameters:**
- `query` (string): Search term for name, specialty, or email

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "user": {
        "_id": "user_id",
        "name": "Dr. Michael Chen",
        "email": "michael@example.com",
        "role": "doctor",
        "avatar": "avatar_url",
        "specialty": "Pediatrics"
      },
      "hasExistingChat": true,
      "conversationId": "user1_user2"
    }
  ]
}
```

---

## Chat Socket.IO Events

### Client to Server Events

#### Join Chat
```javascript
socket.emit('join', userId);
```

#### Leave Chat
```javascript
socket.emit('leave', userId);
```

#### Join Conversation
```javascript
socket.emit('join_conversation', conversationId);
```

#### Leave Conversation
```javascript
socket.emit('leave_conversation', conversationId);
```

#### Typing Start
```javascript
socket.emit('typing_start', {
  conversationId: 'user1_user2',
  userId: 'user_id'
});
```

#### Typing Stop
```javascript
socket.emit('typing_stop', {
  conversationId: 'user1_user2',
  userId: 'user_id'
});
```

#### Message Delivered
```javascript
socket.emit('message_delivered', {
  messageId: 'message_id',
  conversationId: 'user1_user2'
});
```

#### Message Read
```javascript
socket.emit('message_read', {
  messageId: 'message_id',
  conversationId: 'user1_user2'
});
```

#### User Away
```javascript
socket.emit('user_away', userId);
```

#### User Back
```javascript
socket.emit('user_back', userId);
```

### Server to Client Events

#### New Message
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
  console.log('Conversation:', data.conversationId);
  console.log('Unread count:', data.unreadCount);
});
```

#### Typing Indicator
```javascript
socket.on('typing_indicator', (data) => {
  console.log('User typing:', data.userId);
  console.log('Conversation:', data.conversationId);
  console.log('Is typing:', data.isTyping);
});
```

#### Message Status Update
```javascript
socket.on('message_status_update', (data) => {
  console.log('Message status updated:', data.messageId);
  console.log('New status:', data.status);
});
```

#### User Status Change
```javascript
socket.on('user_status_change', (data) => {
  console.log('User status changed:', data.userId);
  console.log('New status:', data.status);
});
```

---

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Example curl command:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "role": "mom",
    "gender": "female"
  }'
```
