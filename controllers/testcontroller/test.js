const mongoose = require('mongoose');
const Bid = require('../../models/Bid');
const Item = require('../../models/item');
const Winner = require('../../models/Winner');
const Subcategory = require('../../models/subcategory');
const SubcategoryResult =require('../../models/SubcategoryResult');
const Payment = require('../../models/Payment');

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
            //   branches: [
            //     // If item is cancelled
            //     { case: { $eq: ["$item.status", "cancelled"] }, then: "cancelled" },
            //     // If item is completed and user is a winner and admin approval is true
            //     { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", true] }] }, then: "winner" },
            //     // If item is completed and user is a winner but admin approval is false
            //     { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "winner"] }, { $eq: ["$winner.adminApproval", false] }] }, then: "winner pending for admin approval" },
            //     // If item is completed and user is a loser
            //     { case: { $and: [{ $eq: ["$item.status", "completed"] }, { $eq: ["$winner.status", "loser"] }] }, then: "loser" },
            //     // If item is in progress
            //     { case: { $eq: ["$item.status", "inprogress"] }, then: "inprogress" },
            //   ],
            //   default: "inprogress",
            // },
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
















exports.aggregateSubcategoryResults = async (req,res) => {

const userId = req.params.id;
const statusFilter = req.query.status; // Get status filter from query parameters
try {
  // Aggregate user bid history from SubcategoryResult
  let bidHistory = await SubcategoryResult.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
      $lookup: {
        from: 'winners',
        localField: 'results',
        foreignField: '_id',
        as: 'winnerDetails',
      },
    },
    {
      $addFields: {
        approvedWinnerCount: {
          $size: {
            $filter: {
              input: '$winnerDetails',
              as: 'winner',
              cond: {
                $and: [
                  { $eq: ['$$winner.status', 'winner'] },
                  { $eq: ['$$winner.adminApproval', true] }
                ]
              }
            }
          }
        },
        pendingWinnerCount: {
          $size: {
            $filter: {
              input: '$winnerDetails',
              as: 'winner',
              cond: {
                $and: [
                  { $eq: ['$$winner.status', 'winner'] },
                  { $eq: ['$$winner.adminApproval', false] }
                ]
              }
            }
          }
        },
        loserCount: {
          $size: {
            $filter: {
              input: '$winnerDetails',
              as: 'winner',
              cond: { $eq: ['$$winner.status', 'loser'] }
            }
          }
        },
        cancelledCount: {
          $size: {
            $filter: {
              input: '$winnerDetails',
              as: 'winner',
              cond: { $eq: ['$$winner.status', 'cancelled'] }
            }
          }
        },
        inProgressCount: {
          $size: {
            $filter: {
              input: '$winnerDetails',
              as: 'winner',
              cond: { $eq: ['$$winner.status', 'inprogress'] }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: {
          subcategoryId: '$subcategory._id',
          subcategoryName: '$subcategory.name'
        },
        totalItems: { $sum: 1 },
        approvedWinnerCount: { $sum: '$approvedWinnerCount' },
        pendingWinnerCount: { $sum: '$pendingWinnerCount' },
        loserCount: { $sum: '$loserCount' },
        cancelledCount: { $sum: '$cancelledCount' },
        inProgressCount: { $sum: '$inProgressCount' },
        items: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        _id: 0,
        subcategoryId: '$_id.subcategoryId',
        subcategoryName: '$_id.subcategoryName',
        totalItems: 1,
        approvedWinnerCount: 1,
        pendingWinnerCount: 1,
        loserCount: 1,
        cancelledCount: 1,
        inProgressCount: 1,
        items: 1,
        itemCount: { $size: "$items" } // Add item count for each subcategory
      }
    }
  ]);

  // Apply status filter if provided
  if (statusFilter) {
    bidHistory = bidHistory.map(group => {
      group.items = group.items.filter(item => item.status === statusFilter);
      return group;
    }).filter(group => group.items.length > 0);
  }

  res.status(200).json({ status: "success", count: bidHistory.length, bidHistory:bidHistory[0] });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}

};






























// exports.getItemBidDetails2 = async (req, res) => {
//   const userId = new mongoose.Types.ObjectId(req.params.userId);
//   const subcategoryResultId = new mongoose.Types.ObjectId(req.params.subcategoryResultId);
//   const statusFilter = req.query.status; // Get status filter from query parameters

//   try {
//     let itemDetails = await SubcategoryResult.aggregate([
//       { $match: { _id: subcategoryResultId, userId } },
//       {
//         $lookup: {
//           from: 'subcategories',
//           localField: 'subcategory',
//           foreignField: '_id',
//           as: 'subcategoryDetails',
//         },
//       },
//       { $unwind: '$subcategoryDetails' },
//       {
//         $lookup: {
//           from: 'winners',
//           localField: 'results',
//           foreignField: '_id',
//           as: 'winnerDetails',
//         },
//       },
//       {
//         $lookup: {
//           from: 'payments',
//           localField: '_id',
//           foreignField: 'winnerid',
//           as: 'paymentDetails',
//         },
//       },
//       {
//         $lookup: {
//           from: 'items',
//           localField: 'winnerDetails.itemId',
//           foreignField: '_id',
//           as: 'itemDetails',
//         },
//       },
//       {
//         $addFields: {
//           approvedWinnerCount: {
//             $size: {
//               $filter: {
//                 input: '$winnerDetails',
//                 as: 'winner',
//                 cond: {
//                   $and: [
//                     { $eq: ['$$winner.status', 'winner'] },
//                     { $eq: ['$$winner.adminApproval', true] }
//                   ]
//                 }
//               }
//             }
//           },
//           pendingWinnerCount: {
//             $size: {
//               $filter: {
//                 input: '$winnerDetails',
//                 as: 'winner',
//                 cond: {
//                   $and: [
//                     { $eq: ['$$winner.status', 'winner'] },
//                     { $eq: ['$$winner.adminApproval', false] }
//                   ]
//                 }
//               }
//             }
//           },
//           loserCount: {
//             $size: {
//               $filter: {
//                 input: '$winnerDetails',
//                 as: 'winner',
//                 cond: { $eq: ['$$winner.status', 'loser'] }
//               }
//             }
//           },
//           cancelledCount: {
//             $size: {
//               $filter: {
//                 input: '$winnerDetails',
//                 as: 'winner',
//                 cond: { $eq: ['$$winner.status', 'cancelled'] }
//               }
//             }
//           },
//           inProgressCount: {
//             $size: {
//               $filter: {
//                 input: '$winnerDetails',
//                 as: 'winner',
//                 cond: { $eq: ['$$winner.status', 'inprogress'] }
//               }
//             }
//           },
//           totalAmount: {
//             $sum: {
//               $map: {
//                 input: '$winnerDetails',
//                 as: 'winner',
//                 in: {
//                   $cond: {
//                     if: {
//                       $or: [
//                         { $eq: ['$$winner.status', 'winner'] },
//                         { $eq: ['$$winner.status', 'winner pending for admin approval'] }
//                       ]
//                     },
//                     then: '$$winner.amount',
//                     else: 0
//                   }
//                 }
//               }
//             }
//           },
//           payed: {
//             $cond: {
//               if: {
//                 $gt: [{
//                   $size: {
//                     $filter: {
//                       input: '$paymentDetails',
//                       as: 'payment',
//                       cond: {
//                         $or: [
//                           { $eq: ['$$payment.status', 'pending'] },
//                           { $eq: ['$$payment.status', 'rejected'] },
//                           { $eq: ['$$payment.status', 'completed'] }
//                         ]
//                       }
//                     }
//                   }
//                 }, 0]
//               },
//               then: { 
//                 $cond: {
//                   if: {
//                     $or: [
//                       { $eq: [{ $arrayElemAt: ['$paymentDetails.status', 0] }, 'completed'] },
//                       { $eq: [{ $arrayElemAt: ['$paymentDetails.status', 0] }, 'pending'] },
//                       { $eq: [{ $arrayElemAt: ['$paymentDetails.status', 0] }, 'rejected'] }
//                     ]
//                   },
//                   then: { $arrayElemAt: ['$paymentDetails.status', 0] },
//                   else: false
//                 }
//               },
//               else: false
//             }
//           }
//         }
//       },
//       // {
//       //   $addFields: {
//       //     'winnerDetails.finalStatus': {
//       //       $map: {
//       //         input: '$winnerDetails',
//       //         as: 'winner',
//       //         in: {
//       //           $cond: {
//       //             if: { $eq: ['$$winner.status', 'winner'] },
//       //             then: {
//       //               $cond: {
//       //                 if: { $eq: ['$$winner.adminApproval', true] },
//       //                 then: 'winner and admin approved',
//       //                 else: 'winner pending for admin approval'
//       //               }
//       //             },
//       //             else: '$$winner.status'
//       //           }
//       //         }
//       //       }
//       //     }
//       //   }
//       // },
//       {
//         $project: {
//           _id: 0,
//           subcategoryId: '$subcategoryDetails._id',
//           subcategoryName: '$subcategoryDetails.name',
//           totalItems: { $sum: 1 },
//           approvedWinnerCount: 1,
//           pendingWinnerCount: 1,
//           loserCount: 1,
//           cancelledCount: 1,
//           inProgressCount: 1,
//           totalAmount: 1,
//           payed: 1,
//           items: {
//             _id: 1,
//             itemId: { $arrayElemAt: ['$winnerDetails.itemId', 0] },
//             item: {
//               $arrayElemAt: ['$itemDetails', 0]
//             },
//             amount: '$amount',
//             winnerDetails: '$winnerDetails',
//             paymentDetails: '$paymentDetails' // Include payment details in the output
//           }
//         }
//       }
//     ]);

//     // Apply status filter if provided
//     if (statusFilter) {
//       itemDetails = itemDetails.map(group => {
//         group.items = group.items.filter(item => item.status === statusFilter);
//         return group;
//       }).filter(group => group.items.length > 0);
//     }

//     if (!itemDetails.length) {
//       return res.status(404).json({ message: 'No items found for the specified subcategory result and status.' });
//     }

//     res.status(200).json({ status: "success", itemDetails:itemDetails[0] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };










exports.getItemBidDetails2 = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const subcategoryResultId = new mongoose.Types.ObjectId(req.params.subcategoryResultId);
  const statusFilter = req.query.status; // Get status filter from query parameters

  try {
    let itemDetails = await SubcategoryResult.aggregate([
      { $match: { _id: subcategoryResultId, userId } },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subcategory',
          foreignField: '_id',
          as: 'subcategoryDetails',
        },
      },
      { $unwind: '$subcategoryDetails' },
      {
        $lookup: {
          from: 'winners',
          localField: 'results',
          foreignField: '_id',
          as: 'winnerDetails',
        },
      },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'winnerid',
          as: 'paymentDetails',
        },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'winnerDetails.itemId',
          foreignField: '_id',
          as: 'itemDetails',
        },
      },
      {
        $addFields: {
          approvedWinnerCount: {
            $size: {
              $filter: {
                input: '$winnerDetails',
                as: 'winner',
                cond: {
                  $and: [
                    { $eq: ['$$winner.status', 'winner'] },
                    { $eq: ['$$winner.adminApproval', true] }
                  ]
                }
              }
            }
          },
          pendingWinnerCount: {
            $size: {
              $filter: {
                input: '$winnerDetails',
                as: 'winner',
                cond: {
                  $and: [
                    { $eq: ['$$winner.status', 'winner'] },
                    { $eq: ['$$winner.adminApproval', false] }
                  ]
                }
              }
            }
          },
          loserCount: {
            $size: {
              $filter: {
                input: '$winnerDetails',
                as: 'winner',
                cond: { $eq: ['$$winner.status', 'loser'] }
              }
            }
          },
          cancelledCount: {
            $size: {
              $filter: {
                input: '$winnerDetails',
                as: 'winner',
                cond: { $eq: ['$$winner.status', 'cancelled'] }
              }
            }
          },
          inProgressCount: {
            $size: {
              $filter: {
                input: '$winnerDetails',
                as: 'winner',
                cond: { $eq: ['$$winner.status', 'inprogress'] }
              }
            }
          },
          totalAmount: {
            $sum: {
              $map: {
                input: '$winnerDetails',
                as: 'winner',
                in: {
                  $cond: {
                    if: {
                      $or: [
                        { $eq: ['$$winner.status', 'winner'] },
                        { $eq: ['$$winner.status', 'winner pending for admin approval'] }
                      ]
                    },
                    then: '$$winner.amount',
                    else: 0
                  }
                }
              }
            }
          },
          payed: {
            $cond: {
              if: {
                $gt: [{
                  $size: {
                    $filter: {
                      input: '$paymentDetails',
                      as: 'payment',
                      cond: {
                        $or: [
                          { $eq: ['$$payment.status', 'pending'] },
                          { $eq: ['$$payment.status', 'rejected'] },
                          { $eq: ['$$payment.status', 'completed'] }
                        ]
                      }
                    }
                  }
                }, 0]
              },
              then: { 
                $cond: {
                  if: {
                    $or: [
                      { $eq: [{ $arrayElemAt: ['$paymentDetails.status', 0] }, 'completed'] },
                      { $eq: [{ $arrayElemAt: ['$paymentDetails.status', 0] }, 'pending'] },
                      { $eq: [{ $arrayElemAt: ['$paymentDetails.status', 0] }, 'rejected'] }
                    ]
                  },
                  then: { $arrayElemAt: ['$paymentDetails.status', 0] },
                  else: false
                }
              },
              else: false
            }
          },
          totalItems: { $size: '$winnerDetails' },
          itemIds: {
            $map: {
              input: '$winnerDetails',
              as: 'winner',
              in: '$$winner.itemId'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          subcategoryId: '$subcategoryDetails._id',
          subcategoryName: '$subcategoryDetails.name',
         
      
          
          totalItems: 1, // Use calculated totalItems from $addFields
          approvedWinnerCount: 1,
          pendingWinnerCount: 1,
          loserCount: 1,
          cancelledCount: 1,
          inProgressCount: 1,
          totalAmount: 1,
          payed: 1,
          items: {
            $map: {
              input: '$winnerDetails',
              as: 'winner',
              in: {
                _id: '$$winner._id',
                itemId: '$$winner.itemId',
                item: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$itemDetails',
                        as: 'item',
                        cond: { $eq: ['$$item._id', '$$winner.itemId'] }
                      }
                    },
                    0
                  ]
                },
                amount: '$$winner.amount',
                status: '$$winner.status',
                adminApproval: '$$winner.adminApproval',
                paymentDetails: {
                  $filter: {
                    input: '$paymentDetails',
                    as: 'payment',
                    cond: { $eq: ['$$payment.winnerid', '$$winner._id'] }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    // Apply status filter if provided
    if (statusFilter) {
      itemDetails = itemDetails.map(group => {
        group.items = group.items.filter(item => item.status === statusFilter);
        return group;
      }).filter(group => group.items.length > 0);
    }

    if (!itemDetails.length) {
      return res.status(404).json({ message: 'No items found for the specified subcategory result and status.' });
    }

    res.status(200).json({ status: "success", itemDetails: itemDetails[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

