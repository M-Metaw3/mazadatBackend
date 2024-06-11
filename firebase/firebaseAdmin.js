// server.js or your main entry file
const path = require('path');


// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


module.exports = admin;