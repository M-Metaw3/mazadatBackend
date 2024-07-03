// const crypto = require('crypto');
// const fetch = require('node-fetch');
// const OTP_LENGTH = 4;

// const generateOTP = () => {
//   return crypto.randomInt(1000, 9999).toString();
// };

// const sendOTP = async (phoneNumber, otpCode) => {
//   const { SMS_API_URL, SMS_API_USERNAME, SMS_API_PASSWORD,SMS_API_Env, SMS_API_SENDER, SMS_API_TEMPLATE } = process.env;
//   const smsApiUrl = `${SMS_API_URL}?environment=${SMS_API_Env}&Username=${SMS_API_USERNAME}&Password=${SMS_API_PASSWORD}&Sender=${SMS_API_SENDER}&Template=${SMS_API_TEMPLATE}&mobile=${phoneNumber}&otp=${otpCode}`;
  
//   try {
//     const response = await fetch(smsApiUrl);
//     console.log(response)
//     const result = await response.json();
//     console.log('OTP sent:', result);
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//   }
// };
// module.exports = {
//   generateOTP,
//   sendOTP,
//   OTP_LENGTH
// };

const crypto = require('crypto');
const fetch = require('node-fetch');
const OTP_LENGTH = 4;

const generateOTP = () => {
  return crypto.randomInt(1000, 9999).toString();
};

const sendOTP = async (phoneNumber, otpCode) => {
  const { SMS_API_URL, SMS_API_USERNAME, SMS_API_PASSWORD, SMS_API_Env, SMS_API_SENDER, SMS_API_TEMPLATE } = process.env;

  const payload = {
    environment: SMS_API_Env,
    Username: SMS_API_USERNAME,
    Password: SMS_API_PASSWORD,
    Sender: SMS_API_SENDER,
    Template: SMS_API_TEMPLATE,
    mobile: phoneNumber,
    otp: otpCode
  };

  try {
    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('OTP sent:', result);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

module.exports = {
  generateOTP,
  sendOTP,
  OTP_LENGTH
};
