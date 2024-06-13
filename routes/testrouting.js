const express = require('express');
const test = require('../controllers/testcontroller/test');

const authMiddleware = require('../middleware/authMiddleware');

const mult = require('../utils/multer');
const AppError = require('../utils/appError');
const router = express.Router();

  router.get('/:userId',test.getUserBidHistory);
  router.get('/:userId/item/:itemId',test.getUserBidHistory);

module.exports = router;
