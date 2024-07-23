const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const RefundRequest = require('../models/RefundReques');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/apiFactory');









router.get('/refund-requests', catchAsync(async (req, res, next) => {
    const refundRequests = await RefundRequest.find().populate('user', 'name phoneNumber idNumber').sort;
  
    res.status(200).json({
      status: 'success',
      data: {
        refundRequests
      }
    });
  }));
  
  router.patch('/refund-requests/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['completed', 'rejected'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }
  
    const refundRequest = await RefundRequest.findByIdAndUpdate(id, { status }, { new: true }).populate('user', 'name phoneNumber idNumber');
  
    if (!refundRequest) {
      return next(new AppError('Refund request not found', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        refundRequest
      }
    });
  }));
  
  router.delete('/refund-requests/:id',factory.deleteOne(RefundRequest))


















router.post('/request-refund', authMiddleware, catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
console.log("user",user);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!user.verified) {
    return next(new AppError('User not verified', 403));
  }

  if (user.blocked) {
    return next(new AppError('User is blocked', 403));
  }
  if (user.walletBalance<0) {
    return next(new AppError('User is have not  balance', 403));
  }
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const existingRequest = await RefundRequest.findOne({ user: userId, requestDate: { $gte: startOfDay } });
  if (existingRequest) {
    return next(new AppError('You can only submit one refund request per day', 400));
  }

  const refundRequest = new RefundRequest({
    user: userId,
  });

  await refundRequest.save();

  res.status(201).json({
    status: 'success',
    data: {
      refundRequest
    }
  });
}));

module.exports = router;
