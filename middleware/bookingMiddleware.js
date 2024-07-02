const User = require('../models/User');
const Subcategory = require('../models/subcategory');
const AppError = require('../utils/appError');

exports.checkWalletBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const subcategory = await Subcategory.findById(req.body.itemId);
    if (!subcategory) {
      return next(new AppError('Subcategory not found', 404));
    }

    req.user = user;
    req.item = subcategory;
    next();
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

exports.validateBookingData = (req, res, next) => {
  const { userId, itemId, billingmethod } = req.body;

  if (!userId || !itemId || !billingmethod) {
    return next(new AppError('All fields are required', 400));
  }

  if (!['mobile', 'bank', 'instapay', 'wallet'].includes(billingmethod)) {
    return next(new AppError('Invalid billing method', 400));
  }

  next();
};
