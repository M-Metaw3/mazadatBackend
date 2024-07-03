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
const bookingfile = require('../../models/bookenigfile');

// const Item = require('../../models/item');
const ItemsSchema = require('../../models/item');
exports.getAllDeposit = factory.getAll(Deposit);
exports.getDeposit = factory.getOne(Deposit);
const admin = require('../../firebase/firebaseAdmin'); // Firebase Admin SDK

const mongoose = require('mongoose');

// Create a new deposit
// exports.createDeposit = async (req, res,next) => {

//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {


//     const { userId,  billingmethod, billImage } = req.body;
//     const item = req.item;
//    const amount= item.deposit
//     const deposit = new Deposit({
//       userId,
//       item: item,
//       amount,
//       billImage,
//       billingmethod,
//       status: billingmethod === 'wallet' ? 'approved' : 'pending',
//       seenByadmin: billingmethod === 'wallet' ? true : false,

//     });
//     const user = await User.findById(userId).session(session);
//     if (billingmethod === 'wallet') {
//       if (user.walletBalance < amount) {

//      return next(new AppError('Insufficient balance', 400));
//       }

//       user.walletBalance -= amount;
//       user.walletTransactions.push({ amount, type: 'deposit', description: `deposit for item ${item.name}` });
//       await user.save({validateBeforeSave:false, session });

//     }

//     await deposit.save({ session });


//     const notification = new Notification({
//       userId,
//       message: billingmethod === 'wallet' ? `Your deposit was successful ${amount} for and approved  ${req.item.name} .` : `Your deposit  ${req.item.name} is pending admin approval.`,
//       itemId: item
//     });

//     if (user && user.fcmToken &&user.islogin ) {
//       const message = {
//         notification: {
//           title: ' booking was successful ',
//           body: billingmethod === 'wallet' ? `Your deposit was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.` 
//         },
//         token: user.fcmToken,
//       };
//       try {
//         await admin.messaging().send(message);
//         console.log('Notification sent successfully');
//       } catch (error) {
//         console.error('Error sending notification:', error);
//         // Handle the error, such as removing the invalid token from the database
//         // or implementing retry logic
//       }
//     } else {
//       console.error('User FCM token not found or invalid');
//       // Handle the case where the user's FCM token is missing or invalid
//     }

//     await notification.save({ session });
//     await session.commitTransaction();
//     session.endSession();
//     res.status(201).json(deposit);
//   } catch (error) {
//     if (error.code === 11000) {
//       return next(new AppError('Booking already exists', 400));
//      }
//     res.status(500).json({ error: error.message });
//   }
// };












// exports.createDeposit = async (req, res,next) => {

//   // const session = await mongoose.startSession();
//   // session.startTransaction();
//   try {


//     const { userId,  billingmethod, billImage } = req.body;
//     const item = req.item;
//    const amount= item.deposit
//     const deposit = new Deposit({
//       userId,
//       item: item,
//       amount,
//       billImage,
//       billingmethod,
//       status: billingmethod === 'wallet' ? 'approved' : 'pending',
//       seenByadmin: billingmethod === 'wallet' ? true : false,

//     });
//     const user = await User.findById(userId);
//     if (billingmethod === 'wallet') {
//       if (user.walletBalance < amount) {

//      return next(new AppError('Insufficient balance', 400));
//       }

//       user.walletBalance -= amount;
//       user.walletTransactions.push({ amount, type: 'deposit', description: `deposit for item ${item.name}` });
//       await user.save({validateBeforeSave:false });

//     }

//     await deposit.save();


//     const notification = new Notification({
//       userId,
//       message: billingmethod === 'wallet' ? `Your deposit was successful ${amount} for and approved  ${req.item.name} .` : `Your deposit  ${req.item.name} is pending admin approval.`,
//       itemId: item
//     });

//     if (user && user.fcmToken &&user.islogin ) {
//       const message = {
//         notification: {
//           title: ' booking was successful ',
//           body: billingmethod === 'wallet' ? `Your deposit was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.` 
//         },
//         token: user.fcmToken,
//       };
//       try {
//         await admin.messaging().send(message);
//         console.log('Notification sent successfully');
//       } catch (error) {
//         console.error('Error sending notification:', error);
//         // Handle the error, such as removing the invalid token from the database
//         // or implementing retry logic
//       }
//     } else {
//       console.error('User FCM token not found or invalid');
//       // Handle the case where the user's FCM token is missing or invalid
//     }

//     await notification.save();
//     // await session.commitTransaction();
//     // session.endSession();
//     res.status(201).json(deposit);
//   } catch (error) {
//     if (error.code === 11000) {
//       return next(new AppError('Booking already exists', 400));
//      }
//     res.status(500).json({ error: error.message });
//   }
// };































// // Fetch notifications for the admin
// exports.getAdminNotifications = async (req, res) => {
//   try {
//     const deposits = await Deposit.find({ seenByadmin: false });
//     res.status(200).json(deposits);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getUserNotifications = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch deposits and populate item field but only select name and _id
//     const deposits = await Deposit.find({ userId, seenByuser: false })
//       .populate({ path: 'item', select: 'name _id' })
//       .select('status item createdAt updatedAt');

//       const transformedDeposits = deposits.map(deposit => {
//         let message;
//         switch (deposit.status) {
//           case 'pending':
//             message = "تم دفع مبلغ التامين بنجاح و سيتم التحقق من المالية في اقرب وقت ممكن";
//             break;
//           case 'approved':
//             message = "تمت الموافقة على الطلب بنجاح";
//             break;
//           case 'rejected':
//             message = "تم رفض الطلب";
//             break;
//           default:
//             message = "حالة غير معروفة";
//         }
  
//         return {
//           _id: deposit._id,
//           _iditem: deposit.item._id,
//           item: deposit.item.name,  // Include only the name of the item
//           status: deposit.status,
//           notification: message,
//         };
//       });
//     // Respond with the transformed data
//     res.status(200).json({
//       data: {

//         data: {
//           notifcatios: transformedDeposits
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Approve a deposit
// exports.approveDeposit = async (req, res) => {
//   try {
//     const { depositId } = req.params;
//     const deposit = await Deposit.findByIdAndUpdate(
//       depositId,
//       { status: 'approved', seenByadmin: true, seenByuser: false },
//       { new: true }
//     );

//     if (!deposit) {
//       return res.status(404).json({ error: 'Deposit not found.' });
//     }

//     res.status(200).json(deposit);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Reject a deposit
// exports.rejectDeposit = async (req, res) => {
//   try {
//     const { depositId } = req.params;
//     const deposit = await Deposit.findByIdAndUpdate(
//       depositId,
//       { status: 'rejected', seenByadmin: true, seenByuser: false },
//       { new: true }
//     );

//     if (!deposit) {
//       return res.status(404).json({ error: 'Deposit not found.' });
//     }

//     res.status(200).json(deposit);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete a deposit
// exports.deleteDeposit = async (req, res) => {
//   try {
//     const { depositId } = req.params;
//     const deposit = await Deposit.findByIdAndDelete(depositId);

//     if (!deposit) {
//       return res.status(404).json({ error: 'Deposit not found.' });
//     }

//     res.status(200).json({ message: 'Deposit deleted successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




























// Helper function to send Firebase notifications
const sendFirebaseNotification = async (user, title, body) => {
  if (user && user.fcmToken ) {
    const message = {
      notification: {
        title,
        body
      },
      token: user.fcmToken,
    };
    try {
      await admin.messaging().send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      // Handle the error, such as removing the invalid token from the database
      // or implementing retry logic
    }
  } else {
    console.error('User FCM token not found or invalid');
  }
};

// Create Deposit
// exports.createDeposit = async (req, res, next) => {
//   try {
//     const { userId, billingmethod, billImage } = req.body;
//     const item = req.item;
//     const amount = item.deposit;

//     const deposit = new Deposit({
//       userId,
//       item,
//       amount,
//       billImage,
//       billingmethod,
//       status: billingmethod === 'wallet' ? 'approved' : 'pending',
//       seenByadmin: billingmethod === 'wallet' ? true : false,
//     });

//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     if (billingmethod === 'wallet') {
//       if (user.walletBalance < amount) {
//         return next(new AppError('Insufficient balance', 400));
//       }

//       user.walletBalance -= amount;
//       user.walletTransactions.push({ amount, type: 'deposit', description: `Deposit for item ${item.name}` });
//       await user.save({ validateBeforeSave: false });
//     }

//     await deposit.save();

//     const notificationMessage = billingmethod === 'wallet' 
//       ? `Your deposit was successful ${amount} for and approved ${req.item.name}.`
//       : `Your deposit ${req.item.name} is pending admin approval.`;

//     const notification = new Notification({
//       userId,
//       message: notificationMessage,
//       itemId: item
//     });

//     await sendFirebaseNotification(user, 'Booking Notification', notificationMessage);
//     await notification.save();

//     res.status(201).json(deposit);
//   } catch (error) {
//     if (error.code === 11000) {
//       return next(new AppError('Booking already exists', 400));
//     }
//     res.status(500).json({ error: error.message });
//   }
// };






exports.createDeposit = async (req, res, next) => {
  try {
    const { userId, billingmethod } = req.body;
    const item = req.item;
    const amount = item.deposit;

    const user = req.user;

    // Step 1: Check wallet balance if billingmethod is wallet
    if (billingmethod === 'wallet') {
      if (user.walletBalance < amount) {
        return next(new AppError('Insufficient balance', 400));
      }

      // Deduct amount from user wallet and update transactions
      user.walletBalance -= amount;
      user.walletTransactions.push({ amount, type: 'deposit', description: `Deposit for item ${item.name}` });
    }

    // Step 2: Create and save the deposit
    const deposit = new Deposit({
      userId,
      item,
      amount,
      billImage: req.body.billImage,
      billingmethod,
      status: billingmethod === 'wallet' ? 'approved' : 'pending',
      seenByadmin: billingmethod === 'wallet'
    });

    await deposit.save();

    // Step 3: Send notification
    const notificationMessage = billingmethod === 'wallet'
      ? `Your deposit of ${amount} for item ${item.name} was successful and approved.`
      : `Your deposit for item ${item.name} is pending admin approval.`;

    const notification = new Notification({
      userId,
      message: notificationMessage,
      itemId: item._id,
      type:'deposit'

    });

    await sendFirebaseNotification(user, 'Deposit Notification', notificationMessage);
    await notification.save();

    // Step 4: Save user changes if billingmethod is wallet
    if (billingmethod === 'wallet') {
      await user.save({ validateBeforeSave: false });
    }

    // If everything succeeded, respond with the deposit
    res.status(201).json(deposit);

  } catch (error) {
    // Rollback operations if an error occurs

    if (error.code === 11000) {
      return next(new AppError('Deposit already exists', 400));
    }

    if (req.body.billingmethod === 'wallet') {
      // If there was an error and billingmethod was wallet, revert the user's wallet changes
      user.walletBalance += req.item.deposit;
      user.walletTransactions.pop();
      await user.save({ validateBeforeSave: false });
    }

    return next(new AppError(`Server error during deposit: ${error.message}`, 500));
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

// Fetch user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

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
        item: deposit.item.name,
        status: deposit.status,
        notification: message,
      };
    });

    res.status(200).json({ data: { notifications: transformedDeposits } });
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

    const user = await User.findById(deposit.userId);
    await sendFirebaseNotification(user, 'Deposit Approved', `Your deposit for ${deposit.item.name} has been approved.`);

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

    const user = await User.findById(deposit.userId);
    await sendFirebaseNotification(user, 'Deposit Rejected', `Your deposit for ${deposit.item.name} has been rejected.`);

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
