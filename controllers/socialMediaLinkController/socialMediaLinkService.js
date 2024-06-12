const SocialMediaLink = require('../../models/SocialMediaLink');

exports.createSocialMediaLink = async (data) => {
  return await SocialMediaLink.create(data);
};

exports.getAllSocialMediaLinks = async () => {
  return await SocialMediaLink.find();
};

exports.getSocialMediaLinkById = async (id) => {
  return await SocialMediaLink.findById(id);
};

exports.updateSocialMediaLink = async (id, data) => {
  return await SocialMediaLink.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSocialMediaLink = async (id) => {
  return await SocialMediaLink.findByIdAndDelete(id);
};
