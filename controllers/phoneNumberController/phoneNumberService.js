const PhoneNumber = require('../../models/PhoneNumber');

exports.createPhoneNumber = async (data) => {
  return await PhoneNumber.create(data);
};

exports.getAllPhoneNumbers = async () => {
  return await PhoneNumber.find();
};

exports.getPhoneNumberById = async (id) => {
  return await PhoneNumber.findById(id);
};

exports.updatePhoneNumber = async (id, data) => {
  return await PhoneNumber.findByIdAndUpdate(id, data, { new: true });
};

exports.deletePhoneNumber = async (id) => {
  return await PhoneNumber.findByIdAndDelete(id);
};
