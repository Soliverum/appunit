// backend/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AppUnit API',
      version: '1.0.0',
      description: 'API documentation for the AppUnit platform backend, managing construction projects, budgets, APUs, etc.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}/api/v1`, // Adjust if your prefix is different or port dynamic
        description: 'Development server V1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { // For JWT
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'objectid', description: 'User ID' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            full_name: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['user', 'project_manager', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          }
        },
        UserRegister: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            full_name: { type: 'string', example: 'John Doe', nullable: true },
            role: { type: 'string', enum: ['user', 'project_manager', 'admin'], default: 'user', nullable: true },
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'objectid' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string' },
            token: { type: 'string', description: 'JWT token (stubbed)' },
          }
        },
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'objectid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'] },
            start_date: { type: 'string', format: 'date', nullable: true },
            end_date: { type: 'string', format: 'date', nullable: true },
            budget: { type: 'number', format: 'float', nullable: true },
            currency: { type: 'string', maxLength: 3 },
            owner_id: { type: 'string', format: 'objectid', description: 'ID of the User who owns the project' },
            // owner_id can also be an object if populated:
            // owner_id: { '$ref': '#/components/schemas/User' } // If always populated and want to show full user
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          }
        },
        NewProject: {
          type: 'object',
          required: ['name', 'owner_id'],
          properties: {
            name: { type: 'string', example: 'New Building Project' },
            description: { type: 'string', nullable: true, example: 'Detailed description of the project.' },
            status: { type: 'string', enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'], default: 'planning', nullable: true },
            start_date: { type: 'string', format: 'date', nullable: true, example: '2024-01-15' },
            end_date: { type: 'string', format: 'date', nullable: true, example: '2025-01-15' },
            budget: { type: 'number', format: 'float', nullable: true, example: 100000.00 },
            currency: { type: 'string', maxLength: 3, default: 'USD', nullable: true, example: 'USD' },
            owner_id: { type: 'string', format: 'objectid', description: 'ID of the User who owns the project', example: '60c72b2f9b1d8c001f8e4d67' },
          }
        },
        UpdateProject: { // Similar to NewProject but all fields optional
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Building Project', nullable: true },
            description: { type: 'string', nullable: true, example: 'Updated description.' },
            status: { type: 'string', enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'], nullable: true },
            start_date: { type: 'string', format: 'date', nullable: true },
            end_date: { type: 'string', format: 'date', nullable: true },
            budget: { type: 'number', format: 'float', nullable: true },
            currency: { type: 'string', maxLength: 3, nullable: true },
            owner_id: { type: 'string', format: 'objectid', nullable: true },
          }
        },
        ErrorResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API docs (your route files)
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
