// backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <--- ADD THIS

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    hashed_password: { // Renamed from password to indicate it's stored hashed
        type: String,
        required: [true, 'Password is required']
        // Minlength validation should be on pre-hashed password, not stored hash
    },
    full_name: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'project_manager', 'admin'],
        default: 'user'
    },
    is_active: {
        type: Boolean,
        default: true
    }
    // JWT tokens are typically not stored in the user model directly unless for specific session management.
    // refreshToken might be stored if using refresh tokens.
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('hashed_password')) {
        return next();
    }
    // It's important that if the field is named 'hashed_password',
    // the input from the user might be 'password' and then hashed into 'hashed_password'.
    // Assuming the plain text password is set to 'this.hashed_password' field before save by controller.
    const salt = await bcrypt.genSalt(10);
    this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
    next();
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.hashed_password);
};

module.exports = mongoose.model('User', userSchema);
