const mongoose = require('mongoose');
const item =require('./item');
const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  pathname: { type: String, required: true }
});
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
  deposit: {
    type: Number,
    min: 0,
    required: true
  },
  notifiedStart: { type: Boolean, default: false },  // Add this field
  notifiedEnd: { type: Boolean, default: false },    // Add this field
  files: {
    type: imageSchema,
    // required: [true, 'Please upload a file for the files!'],
    // unique: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  seletedtoslider: {
type: Boolean,
default: false
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



subcategorySchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'subcategoryId',
  // count: true 
  // This tells Mongoose to count the number of related documents
});
subcategorySchema.pre('find', async function(next) {
  this.populate({
    path: 'categoryId',
    select: 'name'});
  next();
});

subcategorySchema.pre('find', async function(next) {
  this.select('-files')
  this.populate({
    path: 'items',
    select: 'name startDate endDate coverphoto'})
  next();
});

subcategorySchema.pre('findOne', function(next) {
  this.populate('categoryId');
  next();
});
// Middleware to cascade delete items when a subcategory is deleted
// subcategorySchema.pre('findOneAndDelete', async function (next) {
//   const Item = mongoose.model('Item');
//   await Item.deleteMany({ subcategoryId: this._id });
//   next();
// });

subcategorySchema.pre('findOneAndDelete', async function (next) {
  try {
    const itemId = this.getQuery()._id;
    console.log(itemId)
    await item.deleteMany({ subcategoryId: itemId });
    next();
  } catch (err) {
    console.log(err)
    next(err);
  }
});



module.exports = mongoose.model('Subcategory', subcategorySchema);


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const subcategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   description: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   itemscount: {
//     type: Number,
//     default: 0
//   },
//   categoryId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true
//   },
//   imagecover: {
//     type: {
//       name: String,
//       path: String,
//       pathname: String
//     },
//     required: [true, 'Please upload an image for the Banner!'],
//     unique: true
//   }
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true },
//   timestamps: true
// });

// // Static method to calculate item counts
// subcategorySchema.statics.calcItemCounts = async function() {
//   const Item = mongoose.model('Item');
  
//   const result = await this.aggregate([
//     {
//       $lookup: {
//         from: 'item',
//         localField: '_id',
//         foreignField: 'subcategoryId',
//         as: 'items'
//       }
//     },
//     {
//       $project: {
//         name: 1,
//         description: 1,
//         categoryId: 1,
//         imagecover: 1,
//         itemscount: { $size: '$items' }
//       }
//     }
//   ]);

//   for (const subcategory of result) {
//     await this.updateOne({ _id: subcategory._id }, { itemscount: subcategory.itemscount });
//   }
// };

// subcategorySchema.pre('find',async function(next) {
// const a = await mongoose.model('Subcategory').aggregate([
//   {
//     $match: { id: this._id }
//   },
//   {
//     $group: {
//       _id: '$Item',

//     }
//   }
// ])
// console.log(a)
//   next();
// });

// // Middleware to populate categoryId
// subcategorySchema.pre('find', function(next) {
//   this.populate('categoryId');
//   next();
// });

// subcategorySchema.pre('findOne', function(next) {
//   this.populate('categoryId');
//   next();
// });

// // Middleware to calculate item counts after find
// subcategorySchema.post('find', async function(docs) {
//   await mongoose.model('Subcategory').calcItemCounts();
// });

// subcategorySchema.post('findOne', async function(doc) {
//   if (doc) {
//     await mongoose.model('Subcategory').calcItemCounts();
//   }
// });

// // Middleware to cascade delete items when a subcategory is deleted
// subcategorySchema.pre('findOneAndDelete', async function(next) {
//   const Item = mongoose.model('Item');
//   await Item.deleteMany({ subcategoryId: this._id });
//   next();
// });

// const Subcategory = mongoose.model('Subcategory', subcategorySchema);

// module.exports = Subcategory;

