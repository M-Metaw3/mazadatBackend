const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.createSubcategory = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('deposit').isFloat({ min: 0 }).withMessage('Deposit must be a non-negative number'),
  body('fileprice').isFloat({ min: 0 }).withMessage('File price must be a non-negative number'),
  body('categoryId').notEmpty().withMessage('Category ID is required'),
  body('startDate').notEmpty().withMessage('Valid start date is required'),
  body('endDate').notEmpty().withMessage('Valid end date is required'),
  body('paymentMethods').isArray().withMessage('Payment methods must be an array'),
  body('imagecover.name').notEmpty().withMessage('Image cover name is required'),
  body('imagecover.path').notEmpty().withMessage('Image cover path is required'),
  body('imagecover.pathname').notEmpty().withMessage('Image cover pathname is required'),
  body('files.name').notEmpty().withMessage('Files name is required'),
  body('files.path').notEmpty().withMessage('Files path is required'),
  body('files.pathname').notEmpty().withMessage('Files pathname is required'),

];
