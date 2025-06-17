// backend/models/resourceModel.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Resource name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Resource type is required'],
        enum: ['labor', 'material', 'equipment', 'subcontract', 'other']
    },
    unit: { // e.g., 'hour', 'sqm', 'piece', 'day', 'item'
        type: String,
        required: [true, 'Resource unit is required']
    },
    unit_cost: {
        type: Number,
        required: [true, 'Resource unit cost is required'],
        min: [0, 'Unit cost cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD',
        maxlength: [3, 'Currency code should be 3 characters']
    },
    supplier: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
