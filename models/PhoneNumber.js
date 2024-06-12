const mongoose = require('mongoose');

const PhoneNumberSchema = new mongoose.Schema({
  en: { type: [String], required: true },
  ar: { type: [String], required: true }
}, { timestamps: true });

const PhoneNumber = mongoose.model('PhoneNumber', PhoneNumberSchema);

module.exports = PhoneNumber;
