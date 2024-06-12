const mongoose = require('mongoose');

const PrivacyPolicySchema = new mongoose.Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true }
}, { timestamps: true });

const PrivacyPolicy = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);

module.exports = PrivacyPolicy;
