// backend/models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Task must belong to a project']
    },
    name: {
        type: String,
        required: [true, 'Task name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'completed', 'blocked', 'on_hold'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    start_date: {
        type: Date
    },
    due_date: {
        type: Date
    },
    assignee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        nullable: true // Task might not be assigned yet
    },
    parent_task_id: { // For subtasks
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        nullable: true
    }
    // sub_tasks can be queried or populated if needed
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
