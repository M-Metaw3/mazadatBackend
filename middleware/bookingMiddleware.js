// middlewares/bookingMiddleware.js

const User = require('../models/User');
const Subcategory = require('../models/subcategory');

exports.checkWalletBalance = async (req, res, next) => {
  try {
    // if (req.body.billingmethod !== 'wallet') {
    //   return next();
    // }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subcategory = await Subcategory.findById(req.body.itemId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }


    req.item = subcategory; 
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.validateBookingData = (req, res, next) => {
  const { userId, itemId, billingmethod } = req.body;
console.log(req.body)
  if (!userId || !itemId || !billingmethod) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['mobile', 'bank', 'instapay', 'wallet'].includes(billingmethod)) {
    return res.status(400).json({ message: 'Invalid billing method' });
  }

  next();
};
