// const mongoose = require('mongoose');

// const subcategoryResultSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
//   status: { type: String, enum: ['winner', 'loser', 'cancelled', 'inprogress'], required: true },
//   items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
//   totalAmount: { type: Number, default: 0 },
//   adminApproval: { type: Boolean, default: false },
//   timestamp: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('SubcategoryResult', subcategoryResultSchema);


const mongoose = require('mongoose');

const SubcategoryResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  totalAmount: { type: Number }, // Only for winners
  status: { type: String, enum: ['winner', 'loser'], required: true },
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Winner' }]
}, { timestamps: true });
SubcategoryResultSchema.index({ userId: 1, subcategory: 1,status:1 }, { unique: true });

module.exports = mongoose.model('SubcategoryResult', SubcategoryResultSchema);


SubcategoryResultSchema.pre('find', function(next) {
  this.populate({
    path: 'subcategory',
  }).populate({
    path: 'results',
  });

  next();
});





