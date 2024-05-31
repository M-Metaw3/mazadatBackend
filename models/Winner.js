const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  amount: Number,
  // status:{type: { type: String, enum: ['winner', 'loser','cancelled'] }},
  status: {
    type: String,
    enum: ['winner', 'loser', 'cancelled','inprogress'],

  },
  timestamp: { type: Date, default: Date.now },
  adminApproval: { type: Boolean, default: false }, 
});

module.exports = mongoose.model('Winner', winnerSchema);