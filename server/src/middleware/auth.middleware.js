const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }

    const user = await User.findById(decoded.id).select('+preferences');
    if (!user) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      username: user.username,
      email: user.email,
      role: 'athlete',
      unitSystem: user.preferences?.unitSystem || 'metric'
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

module.exports = authMiddleware;
