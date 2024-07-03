// middleware/validatePaymentMethod.js
const { check, validationResult } = require('express-validator');

const validatePaymentMethod = [
  check('type').isIn(['mobile', 'bank', 'instapay', 'wallet']).withMessage('Invalid payment method type'),
  check('description').notEmpty().withMessage('Description is required'),
  check('accountNumber').notEmpty().withMessage('Account number is required'),
  check('address').if((value, { req }) => req.body.type === 'bank').notEmpty().withMessage('Address is required for bank payment method'),
  check('iban').if((value, { req }) => req.body.type === 'bank').notEmpty().withMessage('IBAN is required for bank payment method'),

];

module.exports = validatePaymentMethod;
