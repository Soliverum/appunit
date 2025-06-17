// backend/tests/project.test.js
const request = require('supertest');
const express = require('express'); // To setup a minimal app for testing routes if server.js is complex
const mongoose = require('mongoose');
const Project = require('../models/projectModel'); // Adjust path as necessary
const User = require('../models/userModel'); // To create a dummy user for owner_id

// We need to import and setup the main app from server.js for supertest
// However, server.js already calls app.listen(). For testing, it's better if listen is conditional.
// For now, let's assume server.js exports the app without starting the server,
// or we create a new app instance here and mount routes.
// A common pattern is to have app.js define the app and server.js import app and start it.
// Let's modify server.js slightly if needed, or create a test app instance.

// For this subtask, let's assume we can get the app from server.js before it listens.
// This might require a small refactor of server.js to export 'app' before 'app.listen'.
// If server.js is:
// const app = express(); ... module.exports = app; (before listen)
// Then we can do: const app = require('../server');

// To avoid complexity of modifying server.js for export now,
// we will re-construct a minimal app and mount the router.
// This is not ideal as it doesn't test the full app middleware stack from server.js
// but is simpler for this subtask.

// --- Alternative: A better approach is to modify server.js to export app ---
// --- For this subtask, I will proceed by creating a minimal app for the router ---
// --- This means global middleware from server.js won't be tested here. ---

const projectRoutes = require('../routes/projectRoutes'); // Adjust path
const app = express();
app.use(express.json()); // Important for req.body parsing
app.use('/api/v1/projects', projectRoutes); // Mount the project routes

// Global variable to store a dummy user's ID
let testOwnerId;

beforeAll(async () => {
    // Create a dummy user to act as owner for projects
    const testUser = new User({
        username: 'testowner',
        email: 'owner@example.com',
        hashed_password: 'password123' // Will be hashed by pre-save hook
    });
    const savedUser = await testUser.save();
    testOwnerId = savedUser._id.toString();
});


describe('Project API Endpoints', () => {
    // Test POST /api/v1/projects
    describe('POST /api/v1/projects', () => {
        it('should create a new project successfully', async () => {
            const projectData = {
                name: 'Test Project 1',
                description: 'Description for test project 1',
                owner_id: testOwnerId
            };
            const res = await request(app)
                .post('/api/v1/projects')
                .send(projectData);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toBe(projectData.name);
            expect(res.body.owner_id.toString()).toBe(testOwnerId);
        });

        it('should fail to create a project without a name', async () => {
            const projectData = { description: 'No name', owner_id: testOwnerId };
            const res = await request(app)
                .post('/api/v1/projects')
                .send(projectData);
            // The controller returns 400 if name/owner_id is missing, Mongoose validation also returns 400.
            expect(res.statusCode).toEqual(400);
        });
         it('should fail to create a project without an owner_id', async () => {
            const projectData = { name: 'No Owner Inc.' };
            const res = await request(app)
                .post('/api/v1/projects')
                .send(projectData);
            expect(res.statusCode).toEqual(400);
        });
    });

    // Test GET /api/v1/projects
    describe('GET /api/v1/projects', () => {
        it('should return a list of projects', async () => {
            // Create a sample project first
            await Project.create({ name: 'Project A', owner_id: testOwnerId });
            await Project.create({ name: 'Project B', owner_id: testOwnerId });

            const res = await request(app).get('/api/v1/projects');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    // Test GET /api/v1/projects/:id
    describe('GET /api/v1/projects/:id', () => {
        it('should return a single project if ID is valid', async () => {
            const project = await Project.create({ name: 'Project C', owner_id: testOwnerId });
            const res = await request(app).get(`/api/v1/projects/${project._id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Project C');
        });

        it('should return 404 if project ID does not exist', async () => {
            const invalidId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).get(`/api/v1/projects/${invalidId}`);
            expect(res.statusCode).toEqual(404);
        });

        it('should return 400 if project ID is invalid format', async () => {
            const res = await request(app).get('/api/v1/projects/invalidObjectId');
            expect(res.statusCode).toEqual(400); // Controller checks for valid ObjectId format
        });
    });

    // Test PUT /api/v1/projects/:id
    describe('PUT /api/v1/projects/:id', () => {
        it('should update an existing project successfully', async () => {
            const project = await Project.create({ name: 'Project D', description: 'Old Desc', owner_id: testOwnerId });
            const updateData = { name: 'Updated Project D', description: 'New Desc' };

            const res = await request(app)
                .put(`/api/v1/projects/${project._id}`)
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.description).toBe(updateData.description);
        });

        it('should return 404 if project ID to update does not exist', async () => {
            const invalidId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .put(`/api/v1/projects/${invalidId}`)
                .send({ name: 'Ghost Project' });
            expect(res.statusCode).toEqual(404);
        });
    });

    // Test DELETE /api/v1/projects/:id
    describe('DELETE /api/v1/projects/:id', () => {
        it('should delete an existing project successfully', async () => {
            const project = await Project.create({ name: 'Project E - To Delete', owner_id: testOwnerId });

            const res = await request(app).delete(`/api/v1/projects/${project._id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Project removed successfully');

            // Verify it's actually deleted
            const deletedProject = await Project.findById(project._id);
            expect(deletedProject).toBeNull();
        });

        it('should return 404 if project ID to delete does not exist', async () => {
            const invalidId = new mongoose.Types.ObjectId().toString();
            const res = await request(app).delete(`/api/v1/projects/${invalidId}`);
            expect(res.statusCode).toEqual(404);
        });
    });
});
