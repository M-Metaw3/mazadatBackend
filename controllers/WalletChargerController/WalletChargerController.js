const WalletCharger = require('../../models/WalletCharger');
const Notification = require('../../models/notification');
const User = require('../../models/User');
const admin = require('../../firebase/firebaseAdmin'); // Firebase Admin SDK
const catchAsync = require('../../utils/catchAsync');
exports.chargeWallet = catchAsync(async (req, res, next) => {
    const { userId, billingMethod, billImage } = req.body;
  
    // Create wallet charger record
    const walletCharger = await WalletCharger.create({ userId, billingMethod, billImage });
  
    // Send notification to user
    await Notification.create({
      userId,
      message: 'You have sent a request for charging.',
    });
  
    // Send notification with Firebase
    const user = await User.findById(userId).select('fcmToken');
    if (user && user.fcmToken) {
      const message = {
        notification: {
          title: 'Charging Request',
          body: 'You have sent a request for charging.',
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
  
    res.status(200).json({ status: 'success', data: walletCharger });
  });
  
exports.reviewWalletCharger = catchAsync(async (req, res, next) => {
  const { paymentId, status, amount } = req.body;
  const walletCharger = await WalletCharger.findById(paymentId);

  if (!walletCharger) {
    return res.status(404).json({ status: 'error', message: 'Wallet Charger not found' });
  }

  walletCharger.status = status;
  if (status === 'completed') {
    walletCharger.amount = amount;

    // Update user wallet balance
    const user = await User.findById(walletCharger.userId);
    user.walletBalance += amount;
    user.walletTransactions.push({
      amount,
      type: 'deposit',
      description: 'Wallet charged by admin',
    });
    await user.save();

    // Send notification to user
    if (user && user.fcmToken&&user.islogin) {
      const message = {
        notification: {
          title: 'Payment Approved',
          body: `Your payment of amount ${amount} has been approved.`,
        },
        token: user.fcmToken,
      };
      await admin.messaging().send(message);
    }
  }

  // Send notification in all cases
  await Notification.create({
    userId: walletCharger.userId,
    message: status === 'completed' ? `Your payment of amount ${amount} has been approved.` : 'Your payment has been rejected.',
  });

  if (walletCharger.status !== 'completed' && user && user.fcmToken) {
    const message = {
      notification: {
        title: 'Payment Status Update',
        body: `Your payment has been ${status}.`,
      },
      token: user.fcmToken,
    };
    await admin.messaging().send(message);
  }

  await walletCharger.save();
  res.status(200).json({ status: 'success', data: walletCharger });
});

exports.getUserChargingHistory = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const chargingHistory = await WalletCharger.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({ status: 'success', data: chargingHistory });
});