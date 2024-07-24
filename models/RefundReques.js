const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refundRequestSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
}, {
  timestamps: true
});


refundRequestSchema.pre('find', function(next) {
  this.populate({
    path: 'user',
    select: 'name phoneNumber'
  });
  next();
});

const RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);

module.exports = RefundRequest;
