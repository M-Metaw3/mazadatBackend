// controllers/bookingController.js

const Booking = require('../../models/bookenigfile');
const User = require('../../models/User');
const Notification = require('../../models/notification');
const mongoose = require('mongoose');
const factory = require('../../utils/apiFactory');
const AppError = require('../../utils/appError');
const admin = require('../../firebase/firebaseAdmin'); // Firebase Admin SDK

exports.bookFile = async (req, res,next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, itemId, billingmethod ,billImage} = req.body;
    const amount = req.item.fileprice; // Assuming req.item is set by the middleware

    // Create booking document
    const newBooking = new Booking({
      userId,
      item: itemId,
      amount,
      billingmethod,
      billImage: billImage,
      seenByadmin: billingmethod === 'wallet' ? true : false,

      status: billingmethod === 'wallet' ? 'approved' : 'pending'
    });

    // Handle wallet payment
    const user = await User.findById(userId).session(session);
    if (billingmethod === 'wallet') {
      if (user.walletBalance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      user.walletBalance -= amount;
      user.walletTransactions.push({ amount, type: 'withdrawal', description: `Booking for item ${itemId}` });
      await user.save({validateBeforeSave:false, session });

    }

    await newBooking.save({ session });

    // Send notification to the user
    const notification = new Notification({
      userId,
      message: billingmethod === 'wallet' ? `Your booking was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.`,
      itemId
    });
    console.log(user)

 
    if (user && user.fcmToken &&user.islogin ) {
      const message = {
        notification: {
          title: ' booking was successful ',
          body: billingmethod === 'wallet' ? `Your booking was successful ${req.item.name}.` : `Your booking files ${req.item.name} is pending admin approval.` 
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
      // Handle the case where the user's FCM token is missing or invalid
    }


    await notification.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error.code)
    if (error.code === 11000) {
     return next(new AppError('Booking already exists', 400));
    }
  return next(new AppError(error, 400));

    
  }
};

exports.getAllBookings = factory.getAll(Booking);
exports.approveBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'approved' ,seenByadmin:true }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const notification = new Notification({
      userId: booking.userId,
      message: 'Your booking has been approved.',
      itemId: booking.item
    });
    await notification.save();

    res.status(200).json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'rejected',seenByadmin:true }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const notification = new Notification({
      userId: booking.userId,
      message: 'Your booking has been rejected.',
      itemId: booking.item
    });
    await notification.save();

    res.status(200).json({ message: 'Booking rejected successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
