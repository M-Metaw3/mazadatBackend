// // scheduledJobs/sendScheduledNotifications.js
// const cron = require('node-cron');
// const Notification = require('../../models/NotificationAdmin');
// const User = require('../../models/User');
// const admin = require('../../firebase/firebaseAdmin');
// const AppError = require('../../utils/appError');

// const sendScheduledNotifications = async () => {
//   const now = new Date();
//   const notifications = await Notification.find({ sendAt: { $lte: now }, sent: false, type: 'scheduled' });

//   for (const notification of notifications) {
//     // Get all users' FCM tokens
//     const users = await User.find({fcmToken: { $exists: true, $ne: null } }).select('fcmToken');
//     const tokens = users.map(user => user.fcmToken);
// console.log(tokens);
//     if (tokens.length > 0) {
//       const firebaseMessage = {
//         notification: { title: notification.title, body: notification.message },
//         tokens,
//       };

//       try {
//         await admin.messaging().sendMulticast(firebaseMessage);
//         notification.sent = true;
//         await notification.save();
//       } catch (error) {
//         console.error('Error sending scheduled notification:', error);
//       }
//     }
//   }
// };

// // Schedule the job to run every minute
// cron.schedule('* * * * *', sendScheduledNotifications);
























const cron = require('node-cron');
const mongoose = require('mongoose');
const Notification = require('../../models/NotificationAdmin');
const User = require('../../models/User');
const admin = require('../../firebase/firebaseAdmin');
const AppError = require('../../utils/appError');

const sendScheduledNotifications = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const now = new Date();
    const notifications = await Notification.find({ sendAt: { $lte: now }, sent: false, type: 'scheduled' }).session(session);

    for (const notification of notifications) {
      // Get all users' FCM tokens
      const users = await User.find({ fcmToken: { $exists: true, $ne: null } }).select('fcmToken').session(session);
      const tokens = users.map(user => user.fcmToken);
      console.log(tokens);

      if (tokens.length > 0) {
        const firebaseMessage = {
          notification: { title: notification.title, body: notification.message },
          tokens,
        };

        try {
          await admin.messaging().sendMulticast(firebaseMessage);
          notification.sent = true;
          await notification.save({ session });
        } catch (error) {
          console.error('Error sending scheduled notification:', error);
          throw new AppError('Error sending scheduled notification', 500);
        }
      }
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction error:', error);
  } finally {
    session.endSession();
  }
};

// Schedule the job to run every minute
cron.schedule('* * * * *', sendScheduledNotifications);
