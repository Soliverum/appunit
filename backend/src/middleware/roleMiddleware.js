// backend/src/middleware/roleMiddleware.js

const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      // User information not available (authMiddleware likely failed or wasn't run)
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Assuming the user object attached by authMiddleware has a 'role' property
    // If roles are stored as an array, you would adjust this check
    const userRole = req.user.role;

    if (requiredRoles.includes(userRole)) {
      // User has the required role
      next();
    } else {
      // User does not have the required role
      res.status(403).json({ message: 'Forbidden: Insufficient role permissions.' });
    }
  };
};

module.exports = roleMiddleware;