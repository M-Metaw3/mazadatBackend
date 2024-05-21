const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/appError');

const authMiddleware = async (req, res, next) => {
  if (!req.header('Authorization')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = req.header('Authorization').replace('Bearer ', '');

  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('Invalid token', 401));
 
    }

    req.user = user;
    next();
  } catch (error) {
  return  res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
