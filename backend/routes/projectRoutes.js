// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectController'); // Assuming controller is in controllers/

// Define routes
router.route('/')
    .post(createProject)
    .get(getProjects);

router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
