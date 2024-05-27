const Items = require('../models/subcategory');
// Middleware for validation
const validateDeposit = async (req, res, next) => {

  const { userId, item, billingmethod, billImage } = req.body;
  // if (userId!== req.user) {
  //   return res.status(400).json({ error: 'DONT PLAY WITH MY CODE' });
  // }
  console.log(req.body)
  // Validate required fields
  if (!userId || !item || !billingmethod || !billImage) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if the item exists and is not expired
  const Item = await Items.findById(item);
  console.log("Item", Item)
  if (!Item || Item.endDate < new Date()) {
    return res.status(400).json({ error: 'Item does not exist or is expired.' });
  }

  req.item = Item;
  next();
};

module.exports = validateDeposit;
