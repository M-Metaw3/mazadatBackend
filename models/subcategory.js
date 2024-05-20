const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    unique: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  imagecover: {
    type: {
        name: String,
        path: String,
        pathname: String
      },
      required: [true, 'Please upload an image for the Banner!'],
      unique: true
  },
}, {
  timestamps: true
});

// Middleware to cascade delete items when a subcategory is deleted
subcategorySchema.pre('findOneAndDelete', async function (next) {
  const Item = mongoose.model('Item');
  await Item.deleteMany({ subcategoryId: this._id });
  next();
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
