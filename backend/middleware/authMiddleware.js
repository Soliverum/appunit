// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // May not be needed for a simple stub

const protect = async (req, res, next) => {
    let token;

    // This is a very basic stub. A real implementation would:
    // 1. Check for 'Bearer <token>' in 'Authorization' header.
    // 2. Verify the token using jwt.verify and process.env.JWT_SECRET.
    // 3. Find the user by ID from the token payload.
    // 4. Attach user to req (req.user).
    // 5. Handle errors (token missing, invalid, expired).

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log('Token found (stub):', token);
            // In a real scenario, verify token here:
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // req.user = await User.findById(decoded.id).select('-hashed_password');

            // For STUB: just logging and calling next if token structure is present
            console.log('Auth middleware: Bearer token present (stub - not verified).');
            next();
        } catch (error) {
            console.error('Token processing error (stub):', error);
            res.status(401).json({ message: 'Not authorized, token failed (stub)' });
        }
    } else {
        console.log('Auth middleware: No token (stub).');
        // In a real scenario, you might allow some routes to be public or enforce token strictly.
        // For a stub, we might just call next() or send 401. Let's send 401 if no auth header.
        res.status(401).json({ message: 'Not authorized, no token (stub)' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        // This is a role authorization stub. A real implementation:
        // 1. Assumes req.user is populated by a preceding 'protect' middleware.
        // 2. Checks if req.user.role is in the allowed roles.
        // if (!req.user || !roles.includes(req.user.role)) {
        //     return res.status(403).json({ message: 'Forbidden: Insufficient role (stub)' });
        // }
        console.log(`Role authorization stub: required roles - ${roles.join(', ')}. User role check needed.`);
        next();
    };
};

module.exports = { protect, authorize };
