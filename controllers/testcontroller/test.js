const Bid = require('../../models/Bid');
const Item = require('../../models/item');
const Winner = require('../../models/Winner');
const mongoose = require('mongoose');






exports.getItemBidDetails = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.itemId);
    const itemId = mongoose.Types.ObjectId(req.params.itemId);
  
    try {
      const itemDetails = await Bid.aggregate([
        { $match: { itemId, userId } },
        {
          $group: {
            _id: "$itemId",
            userBids: { $push: "$$ROOT" },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $lookup: {
            from: 'items',
            localField: '_id',
            foreignField: '_id',
            as: 'item',
          },
        },
        { $unwind: "$item" },
        {
          $lookup: {
            from: 'bids',
            localField: '_id',
            foreignField: 'itemId',
            as: 'allBids',
          },
        },
        {
          $lookup: {
            from: 'winners',
            let: { itemId: "$_id", userId: userId },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$itemId", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }] } } },
              { $project: { status: 1 } },
            ],
            as: 'winner',
          },
        },
        { $unwind: { path: "$winner", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            status: { $ifNull: ["$winner.status", "active"] },
          },
        },
        {
          $project: {
            _id: 0,
            item: 1,
            userBids: 1,
            allBids: 1,
            totalAmount: 1,
            status: 1,
          },
        },
      ]);
  
      if (!itemDetails.length) {
        return res.status(404).json({ message: 'Item not found or no bids by the user.' });
      }
  
      res.status(200).json(itemDetails[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  



// exports.getUserBidHistory = async (req, res) => {
//   const userId = req.params.userId
// console.log(userId)
//   try {
  
//           // Aggregate user bids
//           const bidHistory = await Bid.aggregate([
//             { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//             {
//               $group: {
//                 _id: "$item",
//                 bids: { $push: "$$ROOT" },
//                 totalAmount: { $sum: "$amount" },
//               },
//             },
//             {
//               $lookup: {
//                 from: 'items',
//                 localField: '_id',
//                 foreignField: '_id',
//                 as: 'item',
//               },
//             },
//             { $unwind: "$item" },
//             {
//               $lookup: {
//                 from: 'winners',
//                 let: { itemId: "$_id", userId: userId },
//                 pipeline: [
//                   { $match: { $expr: { $and: [{ $eq: ["$itemId", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }] } } },
//                   { $project: { status: 1 } },
//                 ],
//                 as: 'winner',
//               },
//             },
//             { $unwind: { path: "$winner", preserveNullAndEmptyArrays: true } },
//             {
//               $addFields: {
//                 status: { $ifNull: ["$winner.status", "inprogress"] },
//               },
//             },
//             {
//               $project: {
//                 _id: 0,
//                 item: 1,
//                 totalAmount: 1,
//                 status: 1,
//               },
//             },
//           ]);
      

//     res.status(200).json({bidhistory:bidHistory});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };







// exports.getUserBidHistory = async (req, res) => {
//     const userId = req.params.userId;
//     console.log(userId);
//     const statusFilter = req.query.status; 
//     console.log(statusFilter)// Get status filter from query parameters
//     try {
//       // Aggregate user bids
//       let bidHistory = await Bid.aggregate([
//         { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//         {
//           $group: {
//             _id: "$item",
//             bids: { $push: "$$ROOT" },
//             totalAmount: { $sum: "$amount" },
//           },
//         },
//         {
//           $lookup: {
//             from: 'items',
//             localField: '_id',
//             foreignField: '_id',
//             as: 'item',
//           },
//         },
//         { $unwind: "$item" },
//         {
//           $lookup: {
//             from: 'winners',
//             let: { itemId: "$_id", userId: new mongoose.Types.ObjectId(userId) },
//             pipeline: [
//               { $match: { $expr: { $and: [{ $eq: ["$itemId", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }] } } },
//               { $project: { status: 1, adminApproval: 1 } },
//             ],
//             as: 'winner',
//           },
//         },
//         { $unwind: { path: "$winner", preserveNullAndEmptyArrays: true } },
//         {
//           $addFields: {
//             status: {
//               $switch: {
//                 branches: [
//                   // If item is cancelled
//                   { case: { $eq: ["$item.status", "cancelled"] }, then: "cancelled" },
//                   // If item is completed and user is a winner and admin approval is true
//                   { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", true] }] }, then: "winner" },
//                   // If item is completed and user is a winner but admin approval is false
//                   { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", false] }] }, then: "winner pending for admin approval" },
//                   // If item is completed and user is a loser
//                   { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "loser"] }] }, then: "loser" },
//                   // If item is in progress
//                   { case: { $eq: ["$item.status", "inprogress"] }, then: "inprogress" },
//                 ],
//                 default: "inprogress",
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             item: 1,
//             totalAmount: 1,
//             status: 1,
//           },
//         },
//       ]);
//       if (statusFilter) {
//         bidHistory = bidHistory.filter(bid => bid.status === statusFilter);
//       }
//       res.status(200).json({ count:bidHistory?.length,bidHistory });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };

exports.getUserBidHistory = async (req, res) => {
  const userId = req.params.userId;
  const statusFilter = req.query.status; // Get status filter from query parameters

  console.log(userId);

  try {
    // Aggregate user bids
    let bidHistory = await Bid.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$item",
          bids: { $push: "$$ROOT" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: "$item" },
      {
        $lookup: {
          from: 'winners',
          let: { itemId: "$_id", userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$itemId", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }] } } },
            { $project: { status: 1, adminApproval: 1 } },
          ],
          as: 'winner',
        },
      },
      { $unwind: { path: "$winner", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'item.subcategoryId',
          foreignField: '_id',
          as: 'item.subcategory',
        },
      },
      { $unwind: { path: '$item.subcategory', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                // If item is cancelled
                { case: { $eq: ["$item.status", "cancelled"] }, then: "cancelled" },
                // If item is completed and user is a winner and admin approval is true
                { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", true] }] }, then: "winner" },
                // If item is completed and user is a winner but admin approval is false
                { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", false] }] }, then: "winner pending for admin approval" },
                // If item is completed and user is a loser
                { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "loser"] }] }, then: "loser" },
                // If item is in progress
                { case: { $eq: ["$item.status", "inprogress"] }, then: "inprogress" },
              ],
              default: "inprogress",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          item: 1,
          totalAmount: 1,
          status: 1,
        },
      },
    ]);

    // Filter the bid history based on the status if the status filter is provided
    if (statusFilter) {
      bidHistory = bidHistory.filter(bid => bid.status === statusFilter);
    }

    res.status(200).json({ bidHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};