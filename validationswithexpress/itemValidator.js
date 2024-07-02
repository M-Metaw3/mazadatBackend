const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.createItem = [
  body('name').notEmpty().withMessage('Name is required'),
  // body('description').notEmpty().withMessage('Description is required'),
  // body('subcategoryId').notEmpty().withMessage('Subcategory ID is required'),
  // body('startPrice').withMessage('Start price must be a non-negative number'),
  // body('minBidIncrement').withMessage('Minimum bid increment must be a non-negative number'),
  // body('coverphoto.name').notEmpty().withMessage('Cover photo name is required'),
  // body('coverphoto.path').notEmpty().withMessage('Cover photo path is required'),
  // body('coverphoto.pathname').notEmpty().withMessage('Cover photo pathname is required'),
  // body('thubnailphoto').withMessage('Thumbnail photos must be an array')
];
