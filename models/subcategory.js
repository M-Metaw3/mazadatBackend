// const mongoose = require('mongoose');
// const item =require('./item');
// const imageSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   path: { type: String, required: true },
//   pathname: { type: String, required: true }
// });
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
//   deposit: {
//     type: Number,
//     min: 0,
//     required: true
//   },
//   fileprice: {
//     type: Number,
//     min: 0,
//     required: true
//   },
//   notifiedStart: { type: Boolean, default: false },  // Add this field
//   notifiedEnd: { type: Boolean, default: false },    // Add this field
//   files: {
//     type: imageSchema,
//     // required: [true, 'Please upload a file for the files!'],
//     // unique: true
//   },
//   categoryId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true
//   },
//   seletedtoslider: {
// type: Boolean,
// default: false
//   },
//   imagecover: {
//     type: {
//         name: String,
//         path: String,
//         pathname: String
//       },
//       required: [true, 'Please upload an image for the Banner!'],
//       unique: true
//   },
//   startDate: {
//     type: Date,
//     required: true
//   },
//   endDate: {
//     type: Date,
//     required: true
//   }
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true },
//   timestamps: true
// });



// subcategorySchema.virtual('items', {
//   ref: 'Item',
//   localField: '_id',
//   foreignField: 'subcategoryId',
//   // count: true 
//   // This tells Mongoose to count the number of related documents
// });
// subcategorySchema.pre('find', async function(next) {
//   this.populate({
//     path: 'categoryId',
//     select: 'name'});
//   next();
// });

// subcategorySchema.pre('find', async function(next) {
//   this.select('-files')
//   this.populate({
//     path: 'items',
//     select: 'name startDate endDate coverphoto'})
//   next();
// });

// subcategorySchema.pre('findOne', function(next) {
//   this.populate('categoryId');
//   next();
// });
// // Middleware to cascade delete items when a subcategory is deleted
// // subcategorySchema.pre('findOneAndDelete', async function (next) {
// //   const Item = mongoose.model('Item');
// //   await Item.deleteMany({ subcategoryId: this._id });
// //   next();
// // });

// subcategorySchema.pre('findOneAndDelete', async function (next) {
//   try {
//     const itemId = this.getQuery()._id;
//     console.log(itemId)
//     await item.deleteMany({ subcategoryId: itemId });
//     next();
//   } catch (err) {
//     console.log(err)
//     next(err);
//   }
// });



// module.exports = mongoose.model('Subcategory', subcategorySchema);

// const mongoose = require('mongoose');
// const item = require('./item');

// const imageSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   path: { type: String, required: true },
//   pathname: { type: String, required: true }
// });

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
//   deposit: {
//     type: Number,
//     min: 0,
//     required: true
//   },
//   fileprice: {
//     type: Number,
//     min: 0,
//     required: true
//   },
//   notifiedStart: { type: Boolean, default: false },
//   notifiedEnd: { type: Boolean, default: false },
//   files: {
//     type: imageSchema
//   },
//   categoryId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true
//   },
//   seletedtoslider: {
//     type: Boolean,
//     default: false
//   },
//   imagecover: {
//     type: {
//       name: String,
//       path: String,
//       pathname: String
//     },
//     required: [true, 'Please upload an image for the Banner!'],
//     unique: true
//   },
//   startDate: {
//     type: Date,
//     required: true
//   },
//   endDate: {
//     type: Date,
//     required: true
//   },
//   paymentMethods: {
//     type: [String],
//     enum: ['wallet', 'fawry', 'bank'],
//     required: true
//   }
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true },
//   timestamps: true
// });

// subcategorySchema.virtual('items', {
//   ref: 'Item',
//   localField: '_id',
//   foreignField: 'subcategoryId'
// });

// subcategorySchema.pre('find', async function(next) {
//   this.populate({
//     path: 'categoryId',
//     select: 'name'
//   });
//   this.populate({
//     path: 'items',
//     select: 'name startDate endDate coverphoto'
//   });
//   this.select('-files');
//   next();
// });

// subcategorySchema.pre('findOne', function(next) {
//   this.populate('categoryId');
//   next();
// });

// subcategorySchema.pre('findOneAndDelete', async function (next) {
//   try {
//     const itemId = this.getQuery()._id;
//     await item.deleteMany({ subcategoryId: itemId });
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = mongoose.model('Subcategory', subcategorySchema);










const mongoose = require('mongoose');
const item = require('./item');

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  pathname: { type: String, required: true }
});

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['wallet', 'fawry', 'bank','instapay'],
    // required: true
  },
  details: {
    type: String,
    // required: true
  }
});

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  fileprice: {
    type: Number,
    min: 0,
    required: true
  },
  notifiedStart: { type: Boolean, default: false },
  notifiedEnd: { type: Boolean, default: false },
  files: {
    type: imageSchema
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
  },
  paymentMethods: [paymentMethodSchema]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

subcategorySchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'subcategoryId'
});

subcategorySchema.pre('find', async function(next) {
  this.populate({
    path: 'categoryId',
    select: 'name'
  });
  this.populate({
    path: 'items',
    select: 'name startDate endDate coverphoto'
  });
  this.select('-files');
  next();
});

subcategorySchema.pre('findOne', function(next) {
  this.populate('categoryId');
  next();
});

subcategorySchema.pre('findOneAndDelete', async function (next) {
  try {
    const itemId = this.getQuery()._id;
    await item.deleteMany({ subcategoryId: itemId });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
