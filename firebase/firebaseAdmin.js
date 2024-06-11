// server.js or your main entry file
const path = require('path');

const fs = require('fs');
// Initialize Firebase Admin SDK
const admin = require('firebase-admin');

const serviceAccountPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log(serviceAccountPath)
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Service account file not found at path: ${serviceAccountPath}`);
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});


module.exports = admin;