const express = require('express');
const subcategoryController = require('../controllers/selectedthinginapp/subcategoryControllerselected');

const Bid = require('../models/Bid');
const Item = require('../models/item');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/selected', subcategoryController.getSelectedSubcategories);
router.get('/search', subcategoryController.search);

router.patch('/:id/slider', subcategoryController.updateSubcategorySlider);



const getUserBids = async (userId) => {
  return await Bid.find({ userId }).populate('item');
};

const getWonItems = async (userId) => {
  return await Bid.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$item', maxBid: { $max: '$amount' } } },
    {
      $lookup: {
        from: 'items',  // Correct collection name should be 'items'
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: '$item' },
    { $match: { 'item.endDate': { $lte: new Date() } } },
    { $sort: { 'item.endDate': -1 } }
  ]);
};

const getLostItems = async (userId) => {
  return await Bid.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$item', maxBid: { $max: '$amount' } } },
    {
      $lookup: {
        from: 'items',  // Correct collection name should be 'items'
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: '$item' },
    { $match: { 'item.endDate': { $lte: new Date() } } },
    {
      $lookup: {
        from: 'bids',  // Correct collection name should be 'bids'
        let: { itemId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$item', '$$itemId'] } } },
          { $sort: { amount: -1 } },
          { $limit: 1 }
        ],
        as: 'highestBid'
      }
    },
    { $unwind: '$highestBid' },
    { $match: { $expr: { $ne: ['$highestBid.userId', new mongoose.Types.ObjectId(userId)] } } },
    { $sort: { 'item.endDate': -1 } }
  ]);
};




router.get('/user/bid-history/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [bids, wonItems, lostItems] = await Promise.all([
      getUserBids(userId),
      getWonItems(userId),
      getLostItems(userId)
    ]);

    res.json({
        wonItems: wonItems,
        lostItems: lostItems,
      bidItems: bids,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bid history' });
  }
});

module.exports = router;


module.exports = router;
