const jwt = require('jsonwebtoken');
const CategorySchema = require('../../models/Category');


const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
exports.getAllCategory = factory.getAll(CategorySchema);
exports.getCategory = factory.getOne(CategorySchema,{ path: 'subcategoryCount'});
exports.createCategory = factory.createOne(CategorySchema);
exports.updateCategory = factory.updateOne(CategorySchema);
exports.deleteCategory = factory.deleteOne(CategorySchema);




// const updateCategory = async (req, res) => {
//     try {
//       const { name } = req.body;
//       const image = req.file ? req.file.path : null;
  
//       const category = await Category.findById(req.params.id);
//       if (!category) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
  
//       category.name = name;
//       if (image) {
//         deleteImage(category.image);
//         category.image = image;
//       }
//       await category.save();
  
//       res.status(200).json(category);
//     } catch (err) {
//       res.status(500).json({ error: 'Server error' });
//     }
//   };
  
//   const deleteCategory = async (req, res) => {
//     try {
//       const category = await Category.findById(req.params.id);
//       if (!category) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
  
//       await category.remove();
//       res.status(200).json({ message: 'Category deleted successfully' });
//     } catch (err) {
//       res.status(500).json({ error: 'Server error' });
//     }
//   };