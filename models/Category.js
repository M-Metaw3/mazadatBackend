
const mongoose = require('mongoose');
const subcategory= require('./subcategory');
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  cover: {
    type: {
        name: String,
        path: String,
        pathname: String
      },
      required: [true, 'Please upload an image for the Category!'],
      unique: true
  },

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

categorySchema.virtual('subcategorycount').get(()=> {
  let subcategorycount = 10;

  
  //  subcategorycount =  subcategory.find({ categoryId: this._id}).countDocuments();

  


  return subcategorycount;
});

categorySchema.virtual('subcategoryCount', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'categoryId',
  // count: true // This tells Mongoose to count the number of related documents
});
// Middleware to cascade delete subcategories when a category is deleted
categorySchema.pre('findByIdAndDelete', async function (next) {
  const Subcategory = mongoose.model('Subcategory');
  await Subcategory.deleteMany({ categoryId: this._id });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
