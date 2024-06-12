const AppShareLink = require('../../models/AppShareLink');

exports.createAppShareLink = async (data) => {
  return await AppShareLink.create(data);
};

exports.getAllAppShareLinks = async () => {
  return await AppShareLink.find();
};

exports.getAppShareLinkById = async (id) => {
  return await AppShareLink.findById(id);
};

exports.updateAppShareLink = async (id, data) => {
  return await AppShareLink.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteAppShareLink = async (id) => {
  return await AppShareLink.findByIdAndDelete(id);
};
