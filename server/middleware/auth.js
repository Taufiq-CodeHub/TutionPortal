const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'ইউজার পাওয়া যায়নি' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'টোকেন ভ্যালিড নয়' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'লগইন করুন, টোকেন পাওয়া যায়নি' });
  }
};

// Role-based access
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'আপনার এই কাজ করার অনুমতি নেই',
      });
    }
    next();
  };
};

module.exports = { protect, requireRole };
