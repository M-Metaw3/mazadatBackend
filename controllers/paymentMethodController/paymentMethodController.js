// controllers/paymentMethodController.js
const PaymentMethod = require('../../models/paymentMethod');
const AppError = require('../../utils/appError');

exports.createPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        paymentMethod
      }
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.status(200).json({
      status: 'success',
      data: {
        paymentMethods
      }
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return next(new AppError('No payment method found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        paymentMethod
      }
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updatePaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!paymentMethod) {
      return next(new AppError('No payment method found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        paymentMethod
      }
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.deletePaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!paymentMethod) {
      return next(new AppError('No payment method found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
