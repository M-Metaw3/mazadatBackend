const PhoneNumberService = require('./phoneNumberService');
const catchAsync = require('../../utils/catchAsync');

exports.createPhoneNumber = catchAsync(async (req, res) => {
  const phoneNumber = await PhoneNumberService.createPhoneNumber(req.body);
  res.status(201).json({ status: 'success', data: phoneNumber });
});

exports.getAllPhoneNumbers = catchAsync(async (req, res) => {
  const phoneNumbers = await PhoneNumberService.getAllPhoneNumbers();
  const language = req.language;

  const formattedNumbers = phoneNumbers.map(doc => {
    if (doc[language]) {
      return {
        phoneNumber: doc[language]
      };
    }
    return doc;
  });

  res.status(200).json({ status: 'success', data: formattedNumbers });
});


exports.getPhoneNumberById = catchAsync(async (req, res) => {
  const phoneNumber = await PhoneNumberService.getPhoneNumberById(req.params.id);
  if (!phoneNumber) {
    return res.status(404).json({ status: 'error', message: 'Phone Number not found' });
  }

  const language = req.language;
  const formattedNumber = { phoneNumber: phoneNumber[language] };

  res.status(200).json({ status: 'success', data: formattedNumber });
});

exports.updatePhoneNumber = catchAsync(async (req, res) => {
  const phoneNumber = await PhoneNumberService.updatePhoneNumber(req.params.id, req.body);
  if (!phoneNumber) {
    return res.status(404).json({ status: 'error', message: 'Phone Number not found' });
  }
  res.status(200).json({ status: 'success', data: phoneNumber });
});

exports.deletePhoneNumber = catchAsync(async (req, res) => {
  const phoneNumber = await PhoneNumberService.deletePhoneNumber(req.params.id);
  if (!phoneNumber) {
    return res.status(404).json({ status: 'error', message: 'Phone Number not found' });
  }
  res.status(204).json({ status: 'success', data: null });
});
