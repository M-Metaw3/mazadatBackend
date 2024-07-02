const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.createBooking = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('billingmethod').isIn(['mobile', 'bank', 'instapay', 'wallet']).withMessage('Invalid billing method')
];
