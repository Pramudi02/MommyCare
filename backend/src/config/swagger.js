const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
