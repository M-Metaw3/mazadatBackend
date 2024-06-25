// controllers/bookingController.js

const Booking = require('../../models/bookenigfile');
const User = require('../../models/User');
const Notification = require('../../models/notification');
const mongoose = require('mongoose');
const factory = require('../../utils/apiFactory');
const AppError = require('../../utils/appError');
const admin = require('../../firebase/firebaseAdmin'); // Firebase Admin SDK

const APIFeatures = require('../../utils/apiFeatures');


// exports.bookFile = async (req, res,next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { userId, itemId, billingmethod ,billImage} = req.body;
//     const amount = req.item.fileprice; // Assuming req.item is set by the middleware

//     // Create booking document
//     const newBooking = new Booking({
//       userId,
//       item: itemId,
//       amount,
//       billingmethod,
//       billImage: billImage,
//       seenByadmin: billingmethod === 'wallet' ? true : false,

//       status: billingmethod === 'wallet' ? 'approved' : 'pending'
//     });


//     // Handle wallet payment
//     const user = await User.findById(userId).session(session);
// console.log(user)

//     if (billingmethod === 'wallet') {
//       if (user.walletBalance < amount) {
//         throw new Error('Insufficient wallet balance');
//       }
// console.log(user.walletBalance,amount)
//       user.walletBalance -= amount;
//       user.walletTransactions.push({ amount, type: 'withdrawal', description: `Booking for item ${itemId}` });
//       await user.save({validateBeforeSave:false, session });

//     }

//     await newBooking.save({ session });

//     // Send notification to the user
//     const notification = new Notification({
//       userId,
//       message: billingmethod === 'wallet' ? `Your booking was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.`,
//       itemId
//     });
//     console.log(user)

 
//     if (user && user.fcmToken &&user.islogin ) {
//       console.log("admin")
//       const message = {
//         notification: {
//           title: ' booking was successful ',
//           body: billingmethod === 'wallet' ? `Your booking was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.` 
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
// console.log("4444")
//     res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.log(error.code)
//     if (error.code === 11000) {
//      return next(new AppError('Booking already exists', 400));
//     }
//   return next(new AppError(error, 400));

    
//   }
// };
















// exports.bookFile = async (req, res,next) => {
//   // const session = await mongoose.startSession();
//   // session.startTransaction();

//   try {
//     const { userId, itemId, billingmethod ,billImage} = req.body;
//     const amount = req.item.fileprice; // Assuming req.item is set by the middleware

//     // Create booking document
//     const newBooking = new Booking({
//       userId,
//       item: itemId,
//       amount,
//       billingmethod,
//       billImage: billImage,
//       seenByadmin: billingmethod === 'wallet' ? true : false,

//       status: billingmethod === 'wallet' ? 'approved' : 'pending'
//     });


//     // Handle wallet payment
//     const user = await User.findById(userId);
// console.log(user)

//     if (billingmethod === 'wallet') {
//       if (user.walletBalance < amount) {
//         throw new Error('Insufficient wallet balance');
//       }
// console.log(user.walletBalance,amount)
//       user.walletBalance -= amount;
//       user.walletTransactions.push({ amount, type: 'withdrawal', description: `Booking for item ${itemId}` });
//       await user.save({validateBeforeSave:false });

//     }

//     await newBooking.save();

//     // Send notification to the user
//     const notification = new Notification({
//       userId,
//       message: billingmethod === 'wallet' ? `Your booking was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.`,
//       itemId
//     });
//     console.log(user)

 
//     if (user && user.fcmToken &&user.islogin ) {
//       console.log("admin")
//       const message = {
//         notification: {
//           title: ' booking was successful ',
//           body: billingmethod === 'wallet' ? `Your booking was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.` 
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
// console.log("4444")
//     res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
//   } catch (error) {
//     // await session.abortTransaction();
//     // session.endSession();
//     console.log(error.code)
//     if (error.code === 11000) {
//      return next(new AppError('Booking already exists', 400));
//     }
//   return next(new AppError(error, 400));

    
//   }
// };



















// exports.getAllBookings = factory.getAll(Booking);
// exports.approveBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'approved' ,seenByadmin:true }, { new: true });
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const notification = new Notification({
//       userId: booking.userId,
//       message: 'Your booking has been approved.',
//       itemId: booking.item
//     });
//     await notification.save();

//     res.status(200).json({ message: 'Booking approved successfully', booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.rejectBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'rejected',seenByadmin:true }, { new: true });
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const notification = new Notification({
//       userId: booking.userId,
//       message: 'Your booking has been rejected.',
//       itemId: booking.item
//     });
//     await notification.save();

//     res.status(200).json({ message: 'Booking rejected successfully', booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };











// exports.getbookinghistory = async (req, res) => {
//   try {
//     const bookingId = req.params.userid;

//     const features = await new APIFeatures(Booking.find({userId:bookingId}).populate('item'), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//     const booking = await features.query.lean();
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     res.status(200).json({ message: 'Booking history', booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




















// Helper function to send Firebase notifications
const sendFirebaseNotification = async (user, title, body) => {
  if (user && user.fcmToken && user.islogin) {
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
    }
  } else {
    console.error('User FCM token not found or invalid');
  }
};

// Book a file
exports.bookFile = async (req, res, next) => {
  try {
    const { userId, itemId, billingmethod, billImage } = req.body;
    const amount = req.item.fileprice;

    const newBooking = new Booking({
      userId,
      item: itemId,
      amount,
      billingmethod,
      billImage,
      seenByadmin: billingmethod === 'wallet' ? true : false,
      status: billingmethod === 'wallet' ? 'approved' : 'pending'
    });

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (billingmethod === 'wallet') {
      if (user.walletBalance < amount) {
        return next(new AppError('Insufficient wallet balance', 400));
      }

      user.walletBalance -= amount;
      user.walletTransactions.push({ amount, type: 'withdrawal', description: `Booking for item ${itemId}` });
      await user.save({ validateBeforeSave: false });
    }

    await newBooking.save();

    const notificationMessage = billingmethod === 'wallet'
      ? `Your booking was successful for ${req.item.name}.`
      : `Your booking for ${req.item.name} is pending admin approval.`;

    const notification = new Notification({
      userId,
      message: notificationMessage,
      itemId
    });

    await sendFirebaseNotification(user, 'Booking Notification', notificationMessage);
    await notification.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Booking already exists', 400));
    }
    next(new AppError(error.message, 500));
  }
};

// Get all bookings
exports.getAllBookings = factory.getAll(Booking);

// Approve a booking
exports.approveBooking = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'approved', seenByadmin: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const notification = new Notification({
      userId: booking.userId,
      message: 'Your booking has been approved.',
      itemId: booking.item
    });
    await notification.save();

    const user = await User.findById(booking.userId);
    await sendFirebaseNotification(user, 'Booking Approved', `Your booking for ${booking.item.name} has been approved.`);

    res.status(200).json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject a booking
exports.rejectBooking = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'rejected', seenByadmin: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const notification = new Notification({
      userId: booking.userId,
      message: 'Your booking has been rejected.',
      itemId: booking.item
    });
    await notification.save();

    const user = await User.findById(booking.userId);
    await sendFirebaseNotification(user, 'Booking Rejected', `Your booking for ${booking.item.name} has been rejected.`);

    res.status(200).json({ message: 'Booking rejected successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get booking history for a user
exports.getbookinghistory = async (req, res) => {
  try {
    const { userid: userId } = req.params;

    const features = new APIFeatures(Booking.find({ userId }).populate('item'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const booking = await features.query.lean();

    if (!booking.length) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    res.status(200).json({ message: 'Booking history', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
