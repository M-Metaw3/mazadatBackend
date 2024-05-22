const Subcategory = require('../../models/subcategory');
const Item = require('../../models/item');
const { Result } = require('express-validator');

// Get all subcategories with `seletedtoslider` true and nearest starting item
// exports.getSelectedSubcategories = async (req, res) => {
//   try {
//     const subcategories = await Subcategory.find({ seletedtoslider: true }).populate('items');

//     const subcategoriesWithNearestItem = await Promise.all(subcategories.map(async (subcategory) => {
//       const nearestItem = await Item.findOne({
//         subcategoryId: subcategory._id,
//         startDate: { $gte: new Date() }
//       }).sort({ startDate: 1 }).exec();

//       return {
//         subcategory,
//         nearestItem
//       };
//     }));
// console.log(subcategoriesWithNearestItem)
//     res.status(200).json({
//       status: 'success',
//       data: subcategoriesWithNearestItem
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };
exports.getSelectedSubcategories = async (req, res) => {
    try {
      const subcategories = await Subcategory.find({ seletedtoslider: true }).populate('items').select('startDate _id');
  
      const subcategoriesWithNearestItem = await Promise.all(subcategories.map(async (subcategory) => {
        const nearestItem = await Item.findOne({
          subcategoryId: subcategory._id,
          startDate: { $gte: new Date() }
        }).sort({ startDate: 1 }).limit(1).exec() || null; // Ensure nearestItem is null if no future item is found
         subcategory.items=undefined;
    console.log(subcategory.items)

        return {
            subcategory,
            nearestItem
        };
    }));

      res.status(200).json({
        status: 'success',
        Result:subcategoriesWithNearestItem.length,
        data: subcategoriesWithNearestItem
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
// Patch subcategory to set `seletedtoslider` value
exports.updateSubcategorySlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { seletedtoslider } = req.body;

    const subcategory = await Subcategory.findByIdAndUpdate(id, { seletedtoslider }, { new: true });

    if (!subcategory) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
