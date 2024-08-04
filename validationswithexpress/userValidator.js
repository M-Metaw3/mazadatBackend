const { body } = require('express-validator');

const userValidator = {

  register : [
    body('name').notEmpty().withMessage('Name is required'),
    body('email'),
    // body('birthdate').isISO8601().withMessage('Valid birthdate is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('idNumber').notEmpty().withMessage('ID number is required'),
    // body('companyname').notEmpty().withMessage('Company name is required'),
    // body('adress').notEmpty().withMessage('Address is required'),
    // body('specialist').notEmpty().withMessage('Specialist field is required')
  ],
  
login : [
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid phone number format'),
    body('idNumber')
      .optional()
      .isLength({ max: 14 })
      .withMessage('ID number must be less than or equal to 14 characters'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
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
    // body('name').optional().notEmpty().withMessage('Name is required'),
    // body('birthdate').optional().isDate().withMessage('Invalid birthdate'),
    // body('phoneNumber').optional().notEmpty().withMessage('Phone number is required'),
    // body('idNumber').optional().notEmpty().withMessage('ID number is required')
  ]
};

module.exports = userValidator;
