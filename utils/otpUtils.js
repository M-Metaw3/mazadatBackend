const crypto = require('crypto');
const OTP_LENGTH = 6;

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = (phoneNumber, otpCode) => {
  // Implement SMS sending logic here
  console.log(`Sending OTP ${otpCode} to phone number ${phoneNumber}`);
};

module.exports = { generateOTP, sendOTP };
