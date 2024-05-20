const jwt = require('jsonwebtoken');
const CategorySchema = require('../../models/subcategory');


const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');


exports.getAllCategory = factory.getAll(CategorySchema);
exports.getCategory = factory.getOne(CategorySchema,{ path: 'categoryId' });
exports.createCategory = factory.createOne(CategorySchema);
exports.updateCategory = factory.updateOne(CategorySchema);
exports.deleteCategory = factory.deleteOne(CategorySchema);













// const Subcategory = require('../models/subcategory');
// const Item = require('../models/item');
// const { deleteImage } = require('../utils/imageUtils');

// const getSubcategories = async (req, res) => {
//   try {
//     const subcategories = await Subcategory.find({ categoryId: req.params.categoryId }).lean();

//     const subcategoriesWithDetails = await Promise.all(subcategories.map(async (subcategory) => {
//       const itemCount = await Item.countDocuments({ subcategoryId: subcategory._id });
//       return { ...subcategory, itemCount };
//     }));

//     res.status(200).json(subcategoriesWithDetails);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const getSubcategoryById = async (req, res) => {
//   try {
//     const subcategory = await Subcategory.findById(req.params.id).lean();
//     if (!subcategory) {
//       return res.status(404).json({ error: 'Subcategory not found' });
//     }

//     const itemCount = await Item.countDocuments({ subcategoryId: subcategory._id });
//     res.status(200).json({ ...subcategory, itemCount });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const createSubcategory = async (req, res) => {
//   try {
//     const { name, categoryId } = req.body;
//     const image = req.file.path;

//     const subcategory = new Subcategory({ name, categoryId, image });
//     await subcategory.save();

//     res.status(201).json(subcategory);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const updateSubcategory = async (req, res) => {
//   try {
//     const { name, categoryId } = req.body;
//     const image = req.file ? req.file.path : null;

//     const subcategory = await Subcategory.findById(req.params.id);
//     if (!subcategory) {
//       return res.status(404).json({ error: 'Subcategory not found' });
//     }

//     subcategory.name = name;
//     subcategory.categoryId = categoryId;
//     if (image) {
//       deleteImage(subcategory.image);
//       subcategory.image = image;
//     }
//     await subcategory.save();

//     res.status(200).json(subcategory);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const deleteSubcategory = async (req, res) => {
//   try {
//     const subcategory = await Subcategory.findById(req.params.id);
//     if (!subcategory) {
//       return res.status(404).json({ error: 'Subcategory not found' });
//     }

//     await subcategory.remove();
//     res.status(200).json({ message: 'Subcategory deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   getSubcategories,
//   getSubcategoryById,
//   createSubcategory,
//   updateSubcategory,
//   deleteSubcategory
// };
