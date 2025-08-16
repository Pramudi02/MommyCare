const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MommyCare API',
      version: '1.0.0',
      description: 'A comprehensive API for MommyCare - Pregnancy and Baby Care Platform',
      contact: {
        name: 'MommyCare Team',
        email: 'support@mommycare.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['mom', 'doctor', 'service_provider', 'admin'] },
            avatar: { type: 'string' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { type: 'string' },
            doctor: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
            reason: { type: 'string' },
            location: { type: 'string' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            sender: { type: 'string' },
            recipient: { type: 'string' },
            content: { type: 'string' },
            read: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Message ID' },
            sender: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                avatar: { type: 'string' },
                role: { type: 'string' },
                specialty: { type: 'string' }
              }
            },
            recipient: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                avatar: { type: 'string' },
                role: { type: 'string' }
              }
            },
            content: { type: 'string', description: 'Message content' },
            messageType: { 
              type: 'string', 
              enum: ['text', 'file', 'image'],
              description: 'Type of message'
            },
            status: { 
              type: 'string', 
              enum: ['sending', 'sent', 'delivered', 'read'],
              description: 'Message status'
            },
            read: { type: 'boolean', description: 'Whether message has been read' },
            readAt: { type: 'string', format: 'date-time', description: 'When message was read' },
            conversationId: { type: 'string', description: 'Generated conversation ID' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Conversation: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Chat ID' },
            conversationId: { type: 'string', description: 'Generated conversation ID' },
            participant: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                avatar: { type: 'string' },
                specialty: { type: 'string' }
              }
            },
            lastMessage: {
              type: 'object',
              properties: {
                content: { type: 'string' },
                sender: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                messageType: { type: 'string' }
              }
            },
            unreadCount: { type: 'number', description: 'Number of unread messages' },
            lastActivity: { type: 'string', format: 'date-time' },
            startedAt: { type: 'string', format: 'date-time' }
          }
        },
        FileUpload: {
          type: 'object',
          properties: {
            filename: { type: 'string', description: 'Generated filename' },
            originalName: { type: 'string', description: 'Original file name' },
            mimetype: { type: 'string', description: 'File MIME type' },
            size: { type: 'number', description: 'File size in bytes' },
            path: { type: 'string', description: 'File storage path' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
