// backend/controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); // For token generation stub

// Utility function to generate JWT (stub)
const generateToken = (id) => {
    // In a real app, use process.env.JWT_SECRET and set an expiration
    return jwt.sign({ id }, 'yourjwtsecretplaceholder', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password, full_name, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            username,
            email,
            hashed_password: password, // UserModel pre-save hook will hash this
            full_name,
            role
        });

        const createdUser = await user.save();

        if (createdUser) {
            res.status(201).json({
                _id: createdUser._id,
                username: createdUser.username,
                email: createdUser.email,
                role: createdUser.role,
                token: generateToken(createdUser._id) // STUB token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error in user registration:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token (login)
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password'});
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id) // STUB token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { registerUser, loginUser };
