const mongoose = require('mongoose');
const Payment = require('../../models/Payment');
const Winner = require('../../models/Winner');
const Item = require('../../models/item');
const User = require('../../models/User');
const Notification = require('../../models/notification');
const AppError = require('../../utils/appError');

const processPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, itemId, winnerid,billingMethod,billImage } = req.body;
    const winner = req.winner;
    const item = req.item;

   
    const dueAmount = req.winner.totalAmount 

    if (dueAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'The due amount must be greater than zero.' });
    }

    const payment = new Payment({
        winnerid,
    //   amount: dueAmount,
      billImage: billImage,

      billingMethod,
      status: billingMethod === 'wallet' ? 'completed' : 'pending'
    });

    if (billingMethod === 'wallet') {
      const user = await User.findById(userId).session(session);

      if (user.walletBalance < dueAmount) {
        await session.abortTransaction();
        session.endSession();
        return next(new Error('Insufficient balance'));
      }

      user.walletBalance -= dueAmount;
      user.walletTransactions.push({ amount: dueAmount, type: 'payment', description: `Payment for item ${item.name}` });
      await user.save({ session, validateBeforeSave: false });
    }

    await payment.save({ session });

    const notification = new Notification({
      userId,
      message: billingMethod === 'wallet' 
        ? `Your payment of ${dueAmount} for ${item.name} was successful.` 
        : `Your payment for ${item.name} is pending admin approval.`,
      itemId
    });

    await notification.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({status:"success",data:payment});
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
        return next(new AppError('you  already payed  exists', 400));
       }
     return next(new AppError(error, 400));
   
  }
};










const approvePayment = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { paymentId, action } = req.body; // action should be 'approve' or 'reject'
      const payment = await Payment.findById(paymentId).session(session);
  
      if (!payment || payment.status !== 'pending') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Invalid payment or payment is not pending.' });
      }
  
      if (action === 'approve') {
        payment.status = 'completed';
        const notification = new Notification({
          userId: payment.userId,
          message: `Your payment of ${payment.amount} for item ${payment.itemId} has been approved.`,
          itemId: payment.itemId
        });
        await notification.save({ session });
      } else if (action === 'reject') {
        payment.status = 'rejected';
        const notification = new Notification({
          userId: payment.userId,
          message: `Your payment of ${payment.amount} for item ${payment.itemId} has been rejected.`,
          itemId: payment.itemId
        });
        await notification.save({ session });
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Invalid action specified.' });
      }
  
      await payment.save({ session });
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ message: `Payment has been ${payment.status}.` });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: error.message });
    }
  };
  
  
  







module.exports = { processPayment,approvePayment };
