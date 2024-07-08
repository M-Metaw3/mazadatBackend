const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const checkPermission = (requiredPermissions) => {
  return catchAsync(async (req, res, next) => {
    console.log("object")
    // Check if token exists in headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Verify token
    const decoded = verifyToken(token);
    const userId = decoded.id;

    // Find the user by ID and populate permissions
    const user = await Admin.findById(userId).populate('permissions');
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
console.log(user)
    // Check if the user has the required permission
    const hasPermission = user.permissions.some(permission =>
      permission.method === req.method && permission.endpoint === req.originalUrl
    );

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    // Grant access to the next middleware
    req.user = user;
    next();
  });
};

module.exports = checkPermission;
