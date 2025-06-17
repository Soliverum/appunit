// backend/controllers/projectController.js
const Project = require('../models/projectModel'); // Assuming projectModel.js is in models/
const mongoose = require('mongoose');

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Public (for now)
const createProject = async (req, res) => {
    try {
        // owner_id should be part of req.body for now.
        // Later, it would come from an authenticated user (req.user.id)
        const { name, description, status, start_date, end_date, budget, currency, owner_id } = req.body;

        if (!name || !owner_id) {
            return res.status(400).json({ message: 'Project name and owner_id are required' });
        }

        // Basic check for owner_id format, though a better check would be against User collection
        if (!mongoose.Types.ObjectId.isValid(owner_id)) {
             return res.status(400).json({ message: 'Invalid owner_id format' });
        }

        const project = new Project({
            name,
            description,
            status,
            start_date,
            end_date,
            budget,
            currency,
            owner_id
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error while creating project' });
    }
};

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public (for now)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).populate('owner_id', 'username email'); // Populate owner details
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error while fetching projects' });
    }
};

// @desc    Get a single project by ID
// @route   GET /api/v1/projects/:id
// @access  Public (for now)
const getProjectById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ message: 'Invalid project ID format' });
        }
        const project = await Project.findById(req.params.id).populate('owner_id', 'username email');

        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: 'Server error while fetching project' });
    }
};

// @desc    Update a project
// @route   PUT /api/v1/projects/:id
// @access  Public (for now)
const updateProject = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ message: 'Invalid project ID format' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update fields that are present in req.body
        const { name, description, status, start_date, end_date, budget, currency, owner_id } = req.body;

        project.name = name || project.name;
        project.description = description === undefined ? project.description : description; // Allow setting description to null/empty
        project.status = status || project.status;
        project.start_date = start_date || project.start_date;
        project.end_date = end_date || project.end_date;
        project.budget = budget === undefined ? project.budget : budget;
        project.currency = currency || project.currency;

        if (owner_id) {
            if (!mongoose.Types.ObjectId.isValid(owner_id)) {
                return res.status(400).json({ message: 'Invalid owner_id format for update' });
            }
            project.owner_id = owner_id;
        }

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error while updating project' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/v1/projects/:id
// @access  Public (for now)
const deleteProject = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ message: 'Invalid project ID format' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Mongoose v6+ findByIdAndDelete is preferred over findByIdAndRemove
        await Project.findByIdAndDelete(req.params.id);
        // or project.deleteOne() if you have the document instance

        res.status(200).json({ message: 'Project removed successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error while deleting project' });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};
