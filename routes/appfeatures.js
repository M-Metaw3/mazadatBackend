const express = require('express');
const subcategoryController = require('../controllers/selectedthinginapp/subcategoryControllerselected');

const Bid = require('../models/Bid');
const Subcategory = require('../models/subcategory');

const Item = require('../models/item');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/selected', subcategoryController.getSelectedSubcategories);
router.get('/search', subcategoryController.search);

router.patch('/:id/slider', subcategoryController.updateSubcategorySlider);



// const getUserBids = async (userId) => {
//   return await Bid.find({ userId }).populate('item');
// };

const getUserBids = async (userId) => {
  const bids = await Bid.find({ userId }).populate({
    path: 'item',
    select: 'startPrice subcategoryId',
    options: { lean: true }
  });

  const updatedBids = await Promise.all(bids.map(async (bid) => {
    if (!bid.item) {
      // Handle the case where item is null
      bid.item = { startPrice: 0, subcategoryId: null };
    }

    const subcategory = bid.item.subcategoryId
      ? await Subcategory.findById(bid.item.subcategoryId).select('deposit').lean()
      : { deposit: 0 };

    const totalBidAmount = bid.amount;
    const depositAmount = subcategory.deposit;
    bid.item.startPrice = totalBidAmount - depositAmount;

    return bid;
  }));

  return updatedBids;
};

// const getWonItems = async (userId) => {
//   return await Bid.aggregate([
//     { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//     { $group: { _id: '$item', maxBid: { $max: '$amount' } } },
//     {
//       $lookup: {
//         from: 'items',  // Correct collection name should be 'items'
//         localField: '_id',
//         foreignField: '_id',
//         as: 'item'
//       }
//     },
//     { $unwind: '$item' },
//     { $match: { 'item.endDate': { $lte: new Date() } } },
//     { $sort: { 'item.endDate': -1 } }
//   ]);
// };

const getWonItems = async (userId) => {
  return await Bid.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$item', totalAmount: { $sum: '$amount' } } },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'item.subcategoryId',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } },
    { $match: { 'subcategory.endDate': { $lte: new Date() } } },
    {
      $lookup: {
        from: 'bids',
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
    { $match: { 'highestBid.userId': new mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        item: 1,
        totalAmount: 1,
        depositAmount: { $ifNull: ['$subcategory.deposit', 0] },
        totalBidMinusDeposit: { $subtract: ['$totalAmount', { $ifNull: ['$subcategory.deposit', 0] }] }
      }
    },
    { $sort: { 'subcategory.endDate': -1 } }
  ]);
};
const getLostItems = async (userId) => {
  return await Bid.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$item', totalAmount: { $sum: '$amount' } } },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'item.subcategoryId',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } },
    { $match: { 'subcategory.endDate': { $lte: new Date() } } },
    {
      $lookup: {
        from: 'bids',
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
    {
      $project: {
        item: 1,
        totalAmount: 1,
        depositAmount: { $ifNull: ['$subcategory.deposit', 0] },
        totalBidMinusDeposit: { $subtract: ['$totalAmount', { $ifNull: ['$subcategory.deposit', 0] }] }
      }
    },
    { $sort: { 'subcategory.endDate': -1 } }
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
    console.log(error)
    res.status(500).json({ error: 'Error fetching bid history' });
  }
});

module.exports = router;


module.exports = router;
