const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authentication middleware function
const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    let token = req.cookies.token;
    
    // Check for Authorization header if no cookie
    if (!token && req.headers.authorization) {
      // Split 'Bearer TOKEN' format
      const auth = req.headers.authorization.split(' ');
      if (auth[0] === 'Bearer') {
        token = auth[1];
      }
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with Sequelize
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = isAuthenticated;
module.exports.isAuthenticated = isAuthenticated; 