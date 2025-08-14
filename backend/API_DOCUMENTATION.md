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
