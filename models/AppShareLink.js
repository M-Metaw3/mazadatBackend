const mongoose = require('mongoose');

const AppShareLinkSchema = new mongoose.Schema({
  en: { type: String },
  ar: { type: String }
}, { timestamps: true });

const AppShareLink = mongoose.model('AppShareLink', AppShareLinkSchema);

module.exports = AppShareLink;
