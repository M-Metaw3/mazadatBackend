// server.js or your main entry file
const path = require('path');


// Initialize Firebase Admin SDK
const admin = require('firebase-admin');

const serviceAccountPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log(serviceAccountPath)
if (!serviceAccountPath) {
  throw new Error('Service account path is not defined');
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});


module.exports = admin;