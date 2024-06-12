const PrivacyPolicy = require('../../models/PrivacyPolicy');

exports.createPrivacyPolicy = async (data) => {
  const privacyPolicy = new PrivacyPolicy(data);
  return await privacyPolicy.save();
};

exports.getAllPrivacyPolicies = async () => {
  return await PrivacyPolicy.find();
};

exports.getPrivacyPolicyById = async (id) => {
  return await PrivacyPolicy.findById(id);
};

exports.updatePrivacyPolicy = async (id, data) => {
  return await PrivacyPolicy.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deletePrivacyPolicy = async (id) => {
  return await PrivacyPolicy.findByIdAndDelete(id);
};
