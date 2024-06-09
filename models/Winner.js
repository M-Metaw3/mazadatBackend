const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  amount: Number,
  // status:{type: { type: String, enum: ['winner', 'loser','cancelled'] }},
  status: {
    type: String,
    enum: ['winner', 'loser', 'cancelled','inprogress'],
  },
  timestamp: { type: Date, default: Date.now },
  adminApproval: { type: Boolean, default: false }, 
});
winnerSchema.index({ itemId: 1 });
winnerSchema.index({ userId: 1 });
winnerSchema.index({ subcategory: 1 });
winnerSchema.index({ status: 1 });
winnerSchema.index({ adminApproval: 1 });


winnerSchema.pre('find', function(next) {
  this.populate({
    path: 'userId',
    select: 'name email photo'
  }).populate({
    path: 'itemId',
    select: 'imagecover name endDate startDate subcategoryId'
  });

  next();
});


module.exports = mongoose.model('Winner', winnerSchema);