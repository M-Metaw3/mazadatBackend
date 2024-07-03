const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mobile', 'bank', 'instapay', 'wallet'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: function () {
      return this.type === 'bank';
    },
  },
  iban: {
    type: String,
    required: function () {
      return this.type === 'bank';
    },
  },
}, {
  timestamps: true
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
