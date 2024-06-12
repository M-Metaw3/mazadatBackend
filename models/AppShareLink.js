const mongoose = require('mongoose');

const AppShareLinkSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true }
}, { timestamps: true });

const AppShareLink = mongoose.model('AppShareLink', AppShareLinkSchema);

module.exports = AppShareLink;
