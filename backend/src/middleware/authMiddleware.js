const jwt = require('jsonwebtoken');

// Replace with your actual JWT secret (get from environment variables in a real app)
const jwtSecret = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (invalid token)
    }
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;