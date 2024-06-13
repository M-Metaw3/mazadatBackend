const admin = require('../firebase/firebaseAdmin');  // Firebase Admin SDK

exports.sendFirebaseNotification = async (fcmToken, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: fcmToken,
  };
  await admin.messaging().send(message);
};
