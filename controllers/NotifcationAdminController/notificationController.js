// controllers/notificationController.js
const Notification = require('../../models/NotificationAdmin');
const User = require('../../models/User');
const admin = require('../../firebase/firebaseAdmin');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// Send immediate notification
exports.sendNotification = catchAsync(async (req, res, next) => {
  const { title, message, adminId } = req.body;

  const notification = await Notification.create({
    title,
    message,
    sendAt: new Date(),
    type: 'immediate',
    adminId,
  });

  // Get all users' FCM tokens
  const users = await User.find({fcmToken: { $exists: true, $ne: null } }).select('fcmToken');
console.log(users)

const tokens = users.map(user => user.fcmToken);
console.log("users",tokens)

  if (tokens.length > 0) {
    const firebaseMessage = {
      notification: { title, body: message },
      tokens,
    };

    try {
      await admin.messaging().sendMulticast(firebaseMessage);
      notification.sent = true;
      await notification.save();
    } catch (error) {
      return next(new AppError('Error sending notification', 500));
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

// Schedule notification
exports.scheduleNotification = catchAsync(async (req, res, next) => {
  const { title, message, sendAt, adminId } = req.body;

  const notification = await Notification.create({
    title,
    message,
    sendAt,
    type: 'scheduled',
    adminId,
  });

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

// Get all notifications
exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find().populate('adminId');

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// Delete notification
exports.deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    return next(new AppError('No notification found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
