const mongoose = require('mongoose');

const splashschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
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

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});














module.exports = mongoose.model('splash', splashschema);
