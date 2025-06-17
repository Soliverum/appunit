// backend/models/projectModel.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        minlength: [3, 'Project name must be at least 3 characters long']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'],
        default: 'planning'
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    budget: {
        type: Number,
        min: [0, 'Budget cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD',
        maxlength: [3, 'Currency code should be 3 characters (e.g., USD)']
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, 'Project must have an owner']
    }
    // `apus`, `budgets`, `tasks` can be populated via virtuals or separate queries
    // or stored as arrays of ObjectIds if direct embedding is desired (can grow large).
    // For now, keeping them separate and will handle relationships via queries.
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
