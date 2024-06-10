const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    winnerid: { type: mongoose.Schema.Types.ObjectId, ref: 'SubcategoryResult', required: true,unique: true },
  billingMethod: { type: String, enum:['mobile', 'bank', 'instapay','wallet'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
  billImage: {
    type: {
        name: String,
        path: String,
        pathname: String
      },
      required: function () {
        return this.billingMethod !== 'wallet';
      },
  },

},{
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
paymentSchema.index({ winnerid: 1 }, { unique: true });

paymentSchema.pre('find', function(next) {
    this.populate({
      path: 'winnerid',
    
    })
  
    next();
  });
  
module.exports = mongoose.model('Payment', paymentSchema);
