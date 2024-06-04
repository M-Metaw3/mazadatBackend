// const jwt = require('jsonwebtoken');
// const DepositeSchema = require('../../models/Deposit');


// const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
// exports.getDeposit = factory.getOne(DepositeSchema);
// exports.createDeposit = factory.createOne(DepositeSchema);
// exports.deleteDeposit = factory.deleteOne(DepositeSchema);

const User = require('../../models/User');
const Notification = require('../../models/notification');
const AppError = require('../../utils/appError');


const Deposit = require('../../models/Deposit');
// const Item = require('../../models/item');
const ItemsSchema = require('../../models/item');
exports.getAllDeposit = factory.getAll(Deposit);
exports.getDeposit = factory.getOne(Deposit);

const mongoose = require('mongoose');

// Create a new deposit
exports.createDeposit = async (req, res,next) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try {


    const { userId,  billingmethod, billImage } = req.body;
    const item = req.item;
   const amount= item.deposit
    const deposit = new Deposit({
      userId,
      item: item,
      amount,
      billImage,
      billingmethod,
      status: billingmethod === 'wallet' ? 'approved' : 'pending',
      seenByadmin: billingmethod === 'wallet' ? true : false,

    });
    if (billingmethod === 'wallet') {
      const user = await User.findById(userId).session(session);
      if (user.walletBalance < amount) {

     return next(new AppError('Insufficient balance', 400));
      }

      user.walletBalance -= amount;
      user.walletTransactions.push({ amount, type: 'deposit', description: `deposit for item ${item.name}` });
      await user.save({validateBeforeSave:false, session });

    }

    await deposit.save({ session });


    const notification = new Notification({
      userId,
      message: billingmethod === 'wallet' ? `Your deposit was successful ${amount} for and approved  ${req.item.name} .` : `Your deposit  ${req.item.name} is pending admin approval.`,
      itemId: item
    });
    await notification.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch notifications for the admin
exports.getAdminNotifications = async (req, res) => {
  try {
    const deposits = await Deposit.find({ seenByadmin: false });
    res.status(200).json(deposits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch deposits and populate item field but only select name and _id
    const deposits = await Deposit.find({ userId, seenByuser: false })
      .populate({ path: 'item', select: 'name _id' })
      .select('status item createdAt updatedAt');

      const transformedDeposits = deposits.map(deposit => {
        let message;
        switch (deposit.status) {
          case 'pending':
            message = "تم دفع مبلغ التامين بنجاح و سيتم التحقق من المالية في اقرب وقت ممكن";
            break;
          case 'approved':
            message = "تمت الموافقة على الطلب بنجاح";
            break;
          case 'rejected':
            message = "تم رفض الطلب";
            break;
          default:
            message = "حالة غير معروفة";
        }
  
        return {
          _id: deposit._id,
          _iditem: deposit.item._id,
          item: deposit.item.name,  // Include only the name of the item
          status: deposit.status,
          notification: message,
        };
      });
    // Respond with the transformed data
    res.status(200).json({
      data: {

        data: {
          notifcatios: transformedDeposits
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Approve a deposit
exports.approveDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await Deposit.findByIdAndUpdate(
      depositId,
      { status: 'approved', seenByadmin: true, seenByuser: false },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found.' });
    }

    res.status(200).json(deposit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject a deposit
exports.rejectDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await Deposit.findByIdAndUpdate(
      depositId,
      { status: 'rejected', seenByadmin: true, seenByuser: false },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found.' });
    }

    res.status(200).json(deposit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a deposit
exports.deleteDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await Deposit.findByIdAndDelete(depositId);

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found.' });
    }

    res.status(200).json({ message: 'Deposit deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
