const { body } = require('express-validator');

const userValidator = {
  register: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('birthdate').isDate().withMessage('Invalid birthdate'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('idNumber').isLength({ min: 14 }).withMessage('Password must be at least 15 characters long'),
    body('idImage').notEmpty().withMessage('Invalid ID image'),
    body('profileImage').notEmpty().withMessage('Invalid profile image image'),



  ],
  login: [
    // body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  forgotPassword: [
    body('email').isEmail().withMessage('Invalid email')
  ],
  resetPassword: [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('otpCode').notEmpty().withMessage('OTP code is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  updateProfile: [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('birthdate').optional().isDate().withMessage('Invalid birthdate'),
    body('phoneNumber').optional().notEmpty().withMessage('Phone number is required'),
    body('idNumber').optional().notEmpty().withMessage('ID number is required')
  ]
};

module.exports = userValidator;
