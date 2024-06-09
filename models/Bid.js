const { required } = require('joi');
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true},
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item',required: true },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  amount: Number,
  bidTime: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
},{
  timestamps: true,
});
bidSchema.pre('find', function (next) {

// this.populate('userId');
next()
})
bidSchema.index({ item: 1 });
bidSchema.index({ userId: 1 });
bidSchema.index({ createdAt: -1 });
const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
