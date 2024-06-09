const mongoose = require('mongoose');
const Bid = require('../../models/Bid');
const Item = require('../../models/item');
const Winner = require('../../models/Winner');
const Subcategory = require('../../models/subcategory');

exports.getUserBidHistory = async (req, res) => {
  const userId = req.params.userId;
  const statusFilter = req.query.status; // Get status filter from query parameters

  try {
    // Aggregate user bids by subcategory and item
    let bidHistory = await Bid.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: '$item' },
      {
        $lookup: {
          from: 'winners',
          let: { itemId: '$item._id', userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$itemId', '$$itemId'] }, { $eq: ['$userId', '$$userId'] }] } } },
            { $project: { status: 1, adminApproval: 1 } },
          ],
          as: 'winner',
        },
      },
      { $unwind: { path: '$winner', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'item.subcategoryId',
          foreignField: '_id',
          as: 'subcategory',
        },
      },
      { $unwind: '$subcategory' },
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $eq: ['$item.status', 'cancelled'] }, then: 'cancelled' },
                { case: { $and: [{ $eq: ['$item.status', 'completed'] }, { $eq: ['$winner.status', 'winner'] }, { $eq: ['$winner.adminApproval', true] }] }, then: 'winner' },
                { case: { $and: [{ $eq: ['$item.status', 'completed'] }, { $eq: ['$winner.status', 'winner'] }, { $eq: ['$winner.adminApproval', false] }] }, then: 'winner pending for admin approval' },
                { case: { $and: [{ $eq: ['$item.status', 'completed'] }, { $eq: ['$winner.status', 'loser'] }] }, then: 'loser' },
                { case: { $eq: ['$item.status', 'inprogress'] }, then: 'inprogress' },
              ],
              default: 'inprogress',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            subcategoryId: '$subcategory._id',
            status: '$status',
          },
          subcategory: { $first: '$subcategory' },
          items: {
            $push: {
              item: '$item',
              status: '$status',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          subcategoryId: '$_id.subcategoryId',
          status: '$_id.status',
          subcategory: 1,
          items: 1,
        },
      },
    ]);

    // Filter the bid history based on the status if the status filter is provided
    if (statusFilter) {
      bidHistory = bidHistory.filter(group => group.status === statusFilter);
    }

    res.status(200).json({ status: "success", count: bidHistory.length, bidHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// exports.getUserBidHistory = async (req, res) => {
//   const userId = req.params.userId;
//   const statusFilter = req.query.status; // Get status filter from query parameters

//   console.log(userId);


//   try {
//     // Aggregate user bids
//     let bidHistory = await Bid.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       {
//         $group: {
//           _id: "$item",
//           bids: { $push: "$$ROOT" },
//           totalAmount: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: 'items',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'item',
//         },
//       },
//       { $unwind: "$item" },
//       {
//         $lookup: {
//           from: 'winners',
//           let: { itemId: "$_id", userId: new mongoose.Types.ObjectId(userId) },
//           pipeline: [
//             { $match: { $expr: { $and: [{ $eq: ["$itemId", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }] } } },
//             { $project: { status: 1, adminApproval: 1 } },
//           ],
//           as: 'winner',
//         },
//       },
//       { $unwind: { path: "$winner", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'subcategories',
//           localField: 'item.subcategoryId',
//           foreignField: '_id',
//           as: 'item.subcategory',
//         },
//       },
//       { $unwind: { path: '$item.subcategory', preserveNullAndEmptyArrays: true } },
//       {
//         $addFields: {
//           status: {
//             $switch: {
//               branches: [
//                 // If item is cancelled
//                 { case: { $eq: ["$item.status", "cancelled"] }, then: "cancelled" },
//                 // If item is completed and user is a winner and admin approval is true
//                 { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", true] }] }, then: "winner" },
//                 // If item is completed and user is a winner but admin approval is false
//                 { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", false] }] }, then: "winner pending for admin approval" },
//                 // If item is completed and user is a loser
//                 { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "loser"] }] }, then: "loser" },
//                 // If item is in progress
//                 { case: { $eq: ["$item.status", "inprogress"] }, then: "inprogress" },
//               ],
//               default: "inprogress",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           item: 1,
//           totalAmount: 1,
//           status: 1,
//         },
//       },
//     ]);

//     // Filter the bid history based on the status if the status filter is provided
//     if (statusFilter) {
//       bidHistory = bidHistory.filter(bid => bid.status === statusFilter);
//     }

//     res.status(200).json({ status:"success",count:bidHistory?.length,bidHistory });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
















// exports.getItemBidDetails = async (req, res) => {
//   const userId = new mongoose.Types.ObjectId(req.params.userId);
//   const itemId = new mongoose.Types.ObjectId(req.params.itemId);

//   try {
//     const itemDetails = await Bid.aggregate([
//       { $match: { item: itemId, userId } },
//       {
//         $group: {
//           _id: "$item",
//           userBids: { $push: "$$ROOT" },
//           totalAmount: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: 'items',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'item',
//         },
//       },
//       { $unwind: "$item" },
//       {
//         $lookup: {
//           from: 'subcategories',
//           localField: 'item.subcategoryId',
//           foreignField: '_id',
//           as: 'item.subcategory',
//         },
//       },
//       {
//         $lookup: {
//           from: 'deposits',
//           let: { itemId: "$_id", userId: userId },
//           pipeline: [
//             { $match: { $expr: { $and: [{ $eq: ["$item", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }, { $eq: ["$status", "approved"] }] } } },
//             { $project: { amount: 1 } },
//           ],
//           as: 'userDeposit',
//         },
//       },
//       { $unwind: { path: "$userDeposit", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'winners',
//           let: { itemId: "$_id", userId: userId },
//           pipeline: [
//             { $match: { $expr: { $and: [{ $eq: ["$itemId", "$$itemId"] }, { $eq: ["$userId", "$$userId"] }] } } },
//             { $project: { amount: 1, status: 1, adminApproval: 1 } },
//           ],
//           as: 'winner',
//         },
//       },
//       { $unwind: { path: "$winner", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'bids',
//           localField: '_id',
//           foreignField: 'item',
//           as: 'allBids',
//         },
//       },
//       {
//         $lookup: {
//           from: 'payments',
//           localField: 'winner._id',
//           foreignField: 'winnerid',
//           as: 'payment',
//         },
//       },
//       { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
//       {
//         $addFields: {
//           numUsersBidding: { $size: { $setUnion: ["$allBids.userId", []] } },
//           commission1: { $multiply: ["$item.startPrice", { $divide: ["$item.commission1", 100] }] },
//           commission2: { $multiply: ["$item.startPrice", { $divide: ["$item.commission2", 100] }] },
//           commission3: { $multiply: ["$item.startPrice", { $divide: ["$item.commission3", 100] }] },
//         },
//       },
//       {
//         $addFields: {
//           totalCommissions: {
//             $sum: [
//               { $ifNull: ["$commission1", 0] },
//               { $ifNull: ["$commission2", 0] },
//               { $ifNull: ["$commission3", 0] }
//             ]
//           },
//           finalAmount: {
//             $subtract: [
//               { $add: ["$item.startPrice", "$totalCommissions"] },
//               { $ifNull: ["$userDeposit.amount", 0] }
//             ]
//           }
//         },
//       },
//       {
//         $addFields: {
//           status: {
//             $switch: {
//               branches: [
//                 { case: { $eq: ["$item.status", "cancelled"] }, then: "cancelled" },
//                 { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", true] }] }, then: "winner" },
//                 { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", false] }] }, then: "winner pending for admin approval" },
//                 { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "loser"] }] }, then: "loser" },
//                 { case: { $eq: ["$item.status", "inprogress"] }, then: "inprogress" },
//               ],
//               default: "inprogress",
//             },
//           },
//           // payedStatus: {
//           //   $cond: {
//           //     if: { $eq: ["$status", "winner"] },
//           //     then: "$payment.status",
//           //     else: "$$REMOVE"
//           //   }
//           // }

//           payedStatus: "$payment.status",

            
          
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           item: 1,
//           userBids: 1,
//           totalAmount: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: "$totalAmount",
//               else: "$$REMOVE"
//             }
//           },
//           commission1: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: "$commission1",
//               else: "$$REMOVE"
//             }
//           },
//           commission2: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: "$commission2",
//               else: "$$REMOVE"
//             }
//           },
//           commission3: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: "$commission3",
//               else: "$$REMOVE"
//             }
//           },
//           totalCommissions: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: "$totalCommissions",
//               else: "$$REMOVE"
//             }
//           },
//           userDeposit: "$userDeposit.amount",
//           finalAmount: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: { $ifNull: ["$winner.amount", "$finalAmount"] },
//               else: "$$REMOVE"
//             }
//           },
//           winnerid: {
//             $cond: {
//               if: {
//                 $or: [
//                   { $eq: ["$status", "winner"] },
//                   { $eq: ["$status", "winner pending for admin approval"] }
//                 ]
//               },
//               then: "$winner._id",
//               else: "$$REMOVE"
//             }
//           },
//           numUsersBidding: 1,
//           status: 1,
//           payedStatus: 1
//         }
//       }
//     ]);

//     if (!itemDetails.length) {
//       return res.status(404).json({ message: 'Item not found or no bids by the user.' });
//     }
// console.log(itemDetails[0].payedStatus)
//     res.status(200).json(itemDetails[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



































exports.getItemBidDetails = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const subcategoryId = new mongoose.Types.ObjectId(req.params.itemId);
  const status = req.query.status; // Get status filter from query parameters

  try {
    const itemDetails = await Bid.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: '$item' },
      { $match: { 'item.subcategoryId': subcategoryId } },
      {
        $lookup: {
          from: 'winners',
          let: { itemId: '$item._id', userId },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$itemId', '$$itemId'] }, { $eq: ['$userId', '$$userId'] }] } } },
            { $project: { amount: 1, status: 1, adminApproval: 1 } },
          ],
          as: 'winner',
        },
      },
      { $unwind: { path: '$winner', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $eq: ['$item.status', 'cancelled'] }, then: 'cancelled' },
                { case: { $and: [{ $eq: ['$item.status', 'completed'] }, { $eq: ['$winner.status', 'winner'] }, { $eq: ['$winner.adminApproval', true] }] }, then: 'winner' },
                { case: { $and: [{ $eq: ['$item.status', 'completed'] }, { $eq: ['$winner.status', 'winner'] }, { $eq: ['$winner.adminApproval', false] }] }, then: 'winner pending for admin approval' },
                { case: { $and: [{ $eq: ['$item.status', 'completed'] }, { $eq: ['$winner.status', 'loser'] }] }, then: 'loser' },
                { case: { $eq: ['$item.status', 'inprogress'] }, then: 'inprogress' },
              ],
              default: 'inprogress',
            },
          },
        },
      },
      { $match: { status } },
      {
        $group: {
          _id: {
            subcategoryId: '$item.subcategoryId',
            status: '$status',
          },
          subcategory: { $first: '$item.subcategoryId' },
          items: { $push: '$$ROOT' },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subcategory',
          foreignField: '_id',
          as: 'subcategory',
        },
      },
      { $unwind: '$subcategory' },
      {
        $project: {
          _id: 0,
          subcategory: '$subcategory',
          status: '$_id.status',
          items: {
            item: '$items.item',
            userBids: '$items.userBids',
            status: '$items.status',
            totalCommissions: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$items.status', 'winner'] },
                    { $eq: ['$items.status', 'winner pending for admin approval'] }
                  ]
                },
                then: '$items.totalCommissions',
                else: '$$REMOVE'
              }
            },
            commission1: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$items.status', 'winner'] },
                    { $eq: ['$items.status', 'winner pending for admin approval'] }
                  ]
                },
                then: '$items.commission1',
                else: '$$REMOVE'
              }
            },
            commission2: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$items.status', 'winner'] },
                    { $eq: ['$items.status', 'winner pending for admin approval'] }
                  ]
                },
                then: '$items.commission2',
                else: '$$REMOVE'
              }
            },
            commission3: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$items.status', 'winner'] },
                    { $eq: ['$items.status', 'winner pending for admin approval'] }
                  ]
                },
                then: '$items.commission3',
                else: '$$REMOVE'
              }
            },
            amount: '$items.amount'
          },
          totalAmount: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$_id.status', 'winner'] },
                  { $eq: ['$_id.status', 'winner pending for admin approval'] }
                ]
              },
              then: '$totalAmount',
              else: '$$REMOVE'
            }
          }
        }
      }
    ]);

    if (!itemDetails.length) {
      return res.status(404).json({ message: 'No items found for the specified subcategory and status.' });
    }

    res.status(200).json({ status: "success", itemDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
