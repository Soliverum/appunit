// backend/models/budgetModel.js
const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
    apu_id: { // Link to an APU
        type: mongoose.Schema.Types.ObjectId,
        ref: 'APU',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative']
    },
    unit_cost: { // Cost of the APU at the time of adding to budget
        type: Number,
        required: true,
        min: [0, 'Unit cost cannot be negative']
    },
    description_override: { // Optional: more specific description for this budget line item
        type: String,
        trim: true
    }
    // total_cost for item = quantity * unit_cost (can be a virtual or calculated on save)
});

const budgetSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Budget must belong to a project']
    },
    name: {
        type: String,
        required: [true, 'Budget name is required'],
        default: 'Project Budget',
        trim: true
    },
    version: {
        type: Number,
        default: 1,
        min: [1, 'Version must be at least 1']
    },
    items: [budgetItemSchema] // Array of APUs or direct items comprising the budget
    // total_amount for budget = sum of total_cost of items (can be a virtual or calculated on save)
}, {
    timestamps: true
});

// Example virtuals (optional, can also be calculated in services/controllers)
// budgetItemSchema.virtual('total_cost').get(function() { return this.quantity * this.unit_cost; });
// budgetSchema.virtual('total_amount').get(function() {
//     return this.items.reduce((acc, item) => acc + (item.quantity * item.unit_cost), 0); // Simplified
// });

module.exports = mongoose.model('Budget', budgetSchema);
