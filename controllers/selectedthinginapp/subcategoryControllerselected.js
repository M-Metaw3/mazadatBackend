const Item = require('../../models/item');
const { Result } = require('express-validator');
const Category = require('../../models/Category');
const Subcategory = require('../../models/subcategory');
const Deposit = require('../../models/Deposit'); // Ensure
// exports.search = async (req, res) => {
//   const { term } = req.query;

//   if (!term) {
//     return res.status(400).json({ error: 'Search term is required' });
//   }

//   try {
//     const categoryResults = await Category.find({ name: { $regex: `^${term}`, $options: 'i' } }).select('name cover').setOptions({ noPopulate: true }).lean()
//     .exec();;
//     const subcategoryResults = await Subcategory.find({ name: { $regex: `^${term}`, $options: 'i' } }).select('name imagecover description').setOptions({ noPopulate: true }).lean()
//     .exec();
//     // const itemResults = await Item.find({ name: { $regex: `^${term}`, $options: 'i' } }).select('name coverphoto description startPrice') .setOptions({ noPopulate: true }).lean()
//     // .exec();
//     const itemResults = await Item.find({ name: { $regex: `^${term}`, $options: 'i' } }).populate('subcategoryId')
//     .exec();

//     return res.status(200).json({
//       categoriessearchresult: categoryResults?.length,
//       categories: categoryResults,
//       subcategoriessearchresult: subcategoryResults?.length,
//       subcategories: subcategoryResults,
//       itemssearchresult: itemResults?.length,
//       items: itemResults,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: 'An error occurred during the search' });
//   }
// };






exports.search = async (req, res) => {
  const { term } = req.query;
  const userId = req.user ? req.user._id : null;
console.log(userId)
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const categoryResults = await Category.find({ name: { $regex: `^${term}`, $options: 'i' } })
      .select('name cover')
      .lean()
      .exec();

    const subcategoryResults = await Subcategory.find({ name: { $regex: `^${term}`, $options: 'i' } })
      .select('name imagecover description')
      .lean()
      .exec();

    const itemResults = await Item.find({ name: { $regex: `^${term}`, $options: 'i' } })
      .populate('subcategoryId')
      .lean()
      .exec();

    // Check deposits and add status
    if (userId) {
      for (const subcategory of subcategoryResults) {
        const deposit = await Deposit.findOne({ userId: userId, item: subcategory._id }).lean().exec();
        subcategory.depositStatus = deposit ? deposit.status : false;
      }

      for (const item of itemResults) {
        const deposit = await Deposit.findOne({ userId: userId, item: item.subcategoryId }).lean().exec();
        item.depositStatus = deposit ? deposit.status : false;
      }
    } else {
      // If no user, set depositStatus to false for all
      subcategoryResults.forEach(subcategory => subcategory.depositStatus = false);
      itemResults.forEach(item => item.depositStatus = false);
    }

    return res.status(200).json({
      categoriessearchresult: categoryResults.length,
      categories: categoryResults,
      subcategoriessearchresult: subcategoryResults.length,
      subcategories: subcategoryResults,
      itemssearchresult: itemResults.length,
      items: itemResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during the search' });
  }
};

















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
      const subcategories = await Subcategory.find({ seletedtoslider: true }).select('-categoryId -items -__v')
  
    //   const subcategoriesWithNearestItem = await Promise.all(subcategories.map(async (subcategory) => {
    //     const nearestItem = await Item.findOne({
    //       subcategoryId: subcategory._id,
    //       startDate: { $gte: new Date() }
    //     }).sort({ startDate: 1 }).limit(1).exec() || null; // Ensure nearestItem is null if no future item is found
    //      subcategory.items=undefined;
    // console.log(subcategory.items)

    //     return {
    //         subcategory,
    //         nearestItem
    //     };
    // }));

      res.status(200).json({
        status: 'success',
        Result:subcategories.length,
        data: subcategories
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


exports.getSubcategories = async (req, res) => {
    try {
      const subcategories = await Subcategory.find().populate('items').select('startDate _id');
  
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

