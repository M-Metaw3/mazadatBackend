const Subcategory = require('../models/subcategory');
const Item = require('../models/item');

const ensureSubcategoryEnded = async (req, res, next) => {
  const { itemId } = req.body;

  try {
    const item = await Item.findById(itemId).populate('subcategoryId');
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    const subcategory = item.subcategoryId;
    const itemsInSubcategory = await Item.find({ subcategoryId: subcategory._id, status: 'inprogress' });
    
    if (itemsInSubcategory.length > 0) {
      return res.status(403).json({ message: 'Subcategory auction is still in progress.' });
    }

    req.item = item; // Store item information for later use
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = ensureSubcategoryEnded;
