// backend/models/apuModel.js
const mongoose = require('mongoose');

const apuItemSchema = new mongoose.Schema({
    resource_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative']
    },
    cost_per_unit: { // This is the cost of the resource at the time of adding to APU
        type: Number,
        required: true,
        min: [0, 'Cost per unit cannot be negative']
    },
    // total_cost for item = quantity * cost_per_unit (can be a virtual or calculated on save)
}, {_id: true}); // Ensure _id for subdocuments if needed for direct manipulation, or false if not. Default is true.

const apuSchema = new mongoose.Schema({
    code: { // Unique code or identifier for the APU
        type: String,
        required: [true, 'APU code is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'APU description is required'],
        trim: true
    },
    unit: { // Unit of the APU itself, e.g., 'sqm', 'm', 'unit'
        type: String,
        required: [true, 'APU unit is required']
    },
    items: [apuItemSchema], // Array of resources and their quantities/costs
    // total_cost for APU = sum of total_cost of items (can be a virtual or calculated on save)
    project_id: { // Optional: if APU is specific to a project, otherwise global template
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: true
});

// Example of a virtual property for total cost of an item (can be done similarly for APU total)
apuItemSchema.virtual('total_cost').get(function() {
    return this.quantity * this.cost_per_unit;
});

// To include virtuals in toJSON and toObject output
// apuItemSchema.set('toJSON', { virtuals: true });
// apuItemSchema.set('toObject', { virtuals: true });
// apuSchema.set('toJSON', { virtuals: true });
// apuSchema.set('toObject', { virtuals: true });


module.exports = mongoose.model('APU', apuSchema);
