
  const mongoose = require('mongoose');

const  Schema  = mongoose.Schema;

const otpSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otpCode: { type: String, required: true },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;
