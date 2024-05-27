const { required } = require('joi');
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item',required: true },
  amount: Number,
  bidTime: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
bidSchema.pre('find', function (next) {

this.populate('userId');
next()
})
const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
