// const express = require('express');
// const Permission = require('../models/permission'); // Adjust the path as needed
// const translate = require('@iamtraction/google-translate');
// const router = express.Router();
// const admin = require('../firebase/firebaseAdmin');
// router.get('/', async (req, res) => {
//   // const { method, endpoint } = req.body;
//   // try {
//   //   const newPermission = new Permission({ method, endpoint });
//   //   await newPermission.save();
//   //   console.log(newPermission)
//   // const translated=await  translate({message:"مزادات مصر"}, { to: 'en' })
//   //   res.status(201).json({ message: 'Permission created', permission: translated.text });
//   // } catch (error) {
//   //   res.status(400).json({ message: 'Error creating permission', error });
//   // }





//   try {
  
//     const message = {
//       notification: {
//         title: "mazadat",
//         body: 'تم ترسية المزاد بنجاح  ',
      
//       },
//       token: 'eEQj-fiHDJHXSxeWxkV4X6:APA91bG8_uV_EkU4IVBKkqB3XrfcsBWnwXSvS-JH-RVlYk5WGKEs1ZVMvbXZhSvYyXrc-jE5vHUt9v5BXMFdNKFQzFbMubS3WLg1MW0PWdGWECzFPky4Q4Mf-uBAZyO27H_5xEs1XjHz',
//       android: {
//         notification: {
//           image: 'https://foo.bar.pizza-monster.png'
//         },
 
//       },
//       webpush: {
//         headers: {
//           image: 'https://foo.bar.pizza-monster.png'
//         }
//       },
//       apns: {
//         payload: {
//           aps: {
//             'mutable-content': 1
//           }
//         },
//         fcm_options: {
//           image: 'https://foo.bar.pizza-monster.png'
//         }
//       },
//     };

//       const response = await admin.messaging().send(message)
    
//       res.status(200).json({ message: 'Notification sent successfully' });
//   } catch (error) {
//     console.error('Error sending notification:', error);
  







// }});


// module.exports = router;






const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Subcategory = require('../models/subcategory');
const User = require('../models/User');
const Deposit = require('../models/Deposit');

router.get('/subcategory/:id', async (req, res) => {
  try {
    const subcategoryId = req.params.id;

    const subcategoryData = await Subcategory.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(subcategoryId) } },
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'subcategoryId',
          as: 'items'
        }
      },
      {
        $unwind: {
          path: '$items',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'bids',
          localField: 'items._id',
          foreignField: 'item',
          as: 'itemBids'
        }
      },
      {
        $addFields: {
          'items.bidCount': { $size: '$itemBids' },
          'items.bidUserCount': {
            $size: {
              $cond: {
                if: { $isArray: '$itemBids' },
                then: { $setUnion: '$itemBids.userId' },
                else: []
              }
            }
          },
          'items.highestBid': { $max: '$itemBids.amount' },
          'items.lastBid': { $arrayElemAt: ['$itemBids', -1] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'items.lastBid.userId',
          foreignField: '_id',
          as: 'lastBidUser'
        }
      },
      {
        $unwind: {
          path: '$lastBidUser',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          'items.lastBid.user': {
            _id: '$lastBidUser._id',
            name: '$lastBidUser.name',
            phoneNumber: '$lastBidUser.phoneNumber'
          }
        }
      },
      {
        $lookup: {
          from: 'deposits',
          let: { subcategoryId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$item', '$$subcategoryId'] }, { $eq: ['$status', 'approved'] }] } } },
            { $group: { _id: null, count: { $sum: 1 }, users: { $addToSet: '$userId' } } }
          ],
          as: 'approvedDeposits'
        }
      },
      {
        $addFields: {
          totalDepositUsersCount: { $arrayElemAt: ['$approvedDeposits.count', 0] },
          totalDepositUsers: { $arrayElemAt: ['$approvedDeposits.users', 0] }
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          imagecover: { $first: '$imagecover' },
          startDate: { $first: '$startDate' },
          endDate: { $first: '$endDate' },
          totalBidCount: { $sum: '$items.bidCount' },
          totalBidUsers: { $addToSet: '$items.lastBid.user._id' },
          items: { $push: '$items' },
          totalDepositUsersCount: { $first: '$totalDepositUsersCount' },
          totalDepositUsers: { $first: '$totalDepositUsers' }
        }
      },
      {
        $addFields: {
          totalBidUsersCount: { $size: '$totalBidUsers' }
        }
      },
      {
        $project: {
          totalBidUsers: 0,
          totalDepositUsers: 0
        }
      }
    ]);

    if (!subcategoryData.length) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json(subcategoryData[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
