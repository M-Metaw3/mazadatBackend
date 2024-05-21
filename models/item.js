const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  startPrice: {
    type: Number,
    required: true
  },
  minBidIncrement: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  numberofitem: {
    type: Number,
    required: true
  },
  coverphoto:{
    type: {
        name: String,
        path: String,
        pathname: String
      },
      required: [true, 'Please upload an image for the item!'],
      unique: true
  },
  thubnailphoto:{
    type: {
        name: String,
        path: String,
        pathname: String
      },
      required: [true, 'Please upload an image for the item!'],
      unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});














module.exports = mongoose.model('Item', itemSchema);
