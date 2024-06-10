// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Subcategory = require('../models/Subcategory');
// const Item = require('../models/Item');
// const Bid = require('../models/Bid');
// const Deposit = require('../models/Deposit');
// const Notification = require('../models/Notification');
// const authenticateSocket = async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error('Authentication error'));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user || user.blocked || !user.verified) {
//       return next(new Error('Authentication error'));
//     }
//     socket.userId = user._id;
//     next();
//   } catch (err) {
//     next(new Error('Authentication error'));
//   }
// };

// const createNotificationNamespace = (io) => {
//     const notificationNamespace = io.of('/notifications');
  
//     notificationNamespace.use(authenticateSocket);
  
//     notificationNamespace.on('connection', (socket) => {
//       console.log(`User ${socket.userId} connected to notifications namespace`);
      
//       // Join user-specific room for notifications
//       socket.join(`user_${socket.userId}`);
      
//       socket.on('disconnect', () => {
//         console.log(`User ${socket.userId} disconnected from notifications namespace`);
//       });
//     });
  
//     return notificationNamespace;
//   };
  
//   module.exports = createNotificationNamespace;


// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   // Check for starting auctions
//   const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });
//   for (const subcategory of startingSubcategories) {
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//         subcategoryId: subcategory._id,
//       });
//       return notification.save();
//     });

//     await Promise.all(startNotifications);

//     subcategory.notifiedStart = true;
//     await subcategory.save();

//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId}`).emit('auctionStarted', {
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//       });
//     });
//   }

//   // Check for ending auctions
//   const endingSubcategories = await Subcategory.find({ endDate: { $lte: now } });
//   for (const subcategory of endingSubcategories) {
//     const items = await Item.find({ subcategoryId: subcategory._id });
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     for (const item of items) {
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//       const winnerBid = bids[0];

//       if (winnerBid) {
//         const winnerNotification = new Notification({
//           userId: winnerBid.userId,
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//           itemId: item._id,
//         });
//         await winnerNotification.save();

//         notificationNamespace.to(`user_${winnerBid.userId}`).emit('auctionEnded', {
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//         });
//       }

//       const endNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
//           itemId: item._id,
//         });
//         return notification.save();
//       });

//       await Promise.all(endNotifications);
//     }

//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId}`).emit('auctionEnded', {
//         message: `The auction for subcategory ${subcategory.name} has ended.`,
//       });
//     });
//   }
// };

// setInterval(() => notifyAuctionEvents(notificationNamespace), 60 * 1000);














// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Subcategory = require('../models/subcategory');
// const Item = require('../models/item');
// const Bid = require('../models/Bid');
// const Deposit = require('../models/Deposit');
// const Notification = require('../models/notification');

// const authenticateSocket = async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error('Authentication error'));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user || user.blocked || !user.verified) {
//       return next(new Error('Authentication error'));
//     }
//     socket.userId = user._id;
//     next();
//   } catch (err) {
//     next(new Error('Authentication error'));
//   }
// };

// const createNotificationNamespace = (io) => {
//   const notificationNamespace = io.of('/notifications');

//   notificationNamespace.use(authenticateSocket);

//   notificationNamespace.on('connection', (socket) => {
//     console.log(`User ${socket.userId} connected to notifications namespace`);

//     // Join user-specific room for notifications
//     socket.join(`user_${socket.userId}`);

//     socket.on('disconnect', () => {
//       console.log(`User ${socket.userId} disconnected from notifications namespace`);
//     });
//   });

//   return notificationNamespace;
// };

// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   // Check for starting auctions
//   const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });
//   for (const subcategory of startingSubcategories) {
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//         subcategoryId: subcategory._id,
//       });
//       return notification.save();
//     });

//     await Promise.all(startNotifications);

//     subcategory.notifiedStart = true;
//     await subcategory.save();

//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId}`).emit('auctionStarted', {
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//       });
//     });
//   }

//   // Check for ending auctions
//   const endingSubcategories = await Subcategory.find({ endDate: { $lte: now } });
//   for (const subcategory of endingSubcategories) {
//     const items = await Item.find({ subcategoryId: subcategory._id });
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     for (const item of items) {
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//       const winnerBid = bids[0];

//       if (winnerBid) {
//         const winnerNotification = new Notification({
//           userId: winnerBid.userId,
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//           itemId: item._id,
//         });
//         await winnerNotification.save();

//         notificationNamespace.to(`user_${winnerBid.userId}`).emit('auctionEnded', {
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//         });
//       }

//       const endNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
//           itemId: item._id,
//         });
//         return notification.save();
//       });

//       await Promise.all(endNotifications);
//     }

//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId}`).emit('auctionEnded', {
//         message: `The auction for subcategory ${subcategory.name} has ended.`,
//       });
//     });
//   }
// };

// const setupNotificationInterval = (notificationNamespace) => {
//   setInterval(() => notifyAuctionEvents(notificationNamespace), 60 * 1000);
// };

// module.exports = {
//   createNotificationNamespace,
//   setupNotificationInterval,
// };












const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subcategory = require('../models/subcategory');
const Item = require('../models/item');
const Bid = require('../models/Bid');
const Deposit = require('../models/Deposit');
const Notification = require('../models/notification');
const Winner = require('../models/Winner');
const authenticateSocket = async (socket, next) => {
  // const token = socket.handshake.auth.token;
  const token = socket.handshake.auth;
  console.log(token)

  // if (!token) {
  //   return next(new Error('Authentication error'));
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findById(decoded.id);
    // if (!user || user.blocked || !user.verified) {
    //   return next(new Error('Authentication error'));
    // }
    // socket.userId = user._id;
  socket.userId = token.userId;

    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};

const createNotificationNamespace = (io) => {
  const notificationNamespace = io.of('/notifications');

  notificationNamespace.use(authenticateSocket);

  notificationNamespace.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected to notifications namespace`);

    // Join user-specific room for notifications
    socket.join(`user_${socket.userId}`);

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from notifications namespace`);
    });
  });

  return notificationNamespace;
};


// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   // Check for starting auctions
//   const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const subcategory of startingSubcategories) {
//     const deposits = await Deposit.find({ subcategory: subcategory._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//         itemId: subcategory._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(startNotifications);

//     subcategory.notifiedStart = true;
//     await subcategory.save();

//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
//         subcategory: subcategory,
//       });
//     });
//   }

//   // Check for ending auctions
//   // const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });
//   const endingSubcategories = await Subcategory.find({ endDate: { $lte: now } });

//   for (const subcategory of endingSubcategories) {
//     const items = await Item.find({ subcategoryId: subcategory._id });
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     for (const item of items) {
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//       const winnerBid = bids[0];
// console.log(winnerBid);
//       if (winnerBid) {
//         const winnerNotification = new Notification({
//           userId: winnerBid.userId,
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//           itemId: item._id,
//         });
//         await winnerNotification.save();

//         // notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
//         //   message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//         // });
//       }

//       const endNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
//           itemId: item._id,
//         });
//         return notification.save();
//       });

//       await Promise.all(endNotifications);
      
//       // Refund deposits for non-winning users
//       deposits.forEach(async deposit => {
//         console.log('Deposit:', deposit.userId);
//         if (!winnerBid || !winnerBid.userId.equals(deposit.userId)) {
//           const user = await User.findById(deposit.userId);
//           user.walletBalance += deposit.amount;
//           await user.save();
//           deposit.status = 'refunded';
//           await deposit.save();

//           notificationNamespace.to(`user_${deposit.userId}`).emit('notification', {
//             message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
//           });
//         }
//       });
//     }

//     // subcategory.notifiedEnd = true;
//     // await subcategory.save();

//     deposits.forEach(deposit => {
//       console.log('Deposit:', deposit.userId)
//       notificationNamespace.to(`user_${deposit.userId}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has ended.`,
//       });
//     });
//   }
// };




// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   // Step 1: Check for auctions that are starting
//   const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const subcategory of startingSubcategories) {
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     // Send notification to each user with an approved deposit
//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//         itemId: subcategory._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(startNotifications);

//     // Mark the subcategory as notified for the start
//     subcategory.notifiedStart = true;
//     await subcategory.save();

//     // Emit real-time notification to each user
//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
//         subcategory: subcategory,
//       });
//     });
//   }

//   // Step 2: Check for auctions that are ending
//   const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });
//   for (const subcategory of endingSubcategories) {
//     const items = await Item.find({ subcategoryId: subcategory._id });
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     for (const item of items) {
//       // Find the highest bid for the item to determine the winner
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 });
//       const winnerBid = bids[0];

//       // Calculate total bids for each user
//       const userBids = {};
//       bids.forEach(bid => {
//         if (!userBids[bid.userId]) userBids[bid.userId] = 0;
//         userBids[bid.userId] += bid.amount;
//       });

//       // Check if the start price equals the sum of all bids for each user
//       let winnerUserId = null;
//       for (const [userId, totalBid] of Object.entries(userBids)) {
//         // Calculate commission (assuming commission1, commission2, commission3 are defined)
//         const commission1 = item.startPrice * (item.commission1 / 100);
//         const commission2 = item.startPrice * (item.commission2 / 100);
//         const commission3 = item.startPrice * (item.commission3 / 100);
//         const totalAfterCommission = parseInt(item.startPrice) + commission1 + commission2 + commission3;
//         console.log(totalAfterCommission)
//         const depositAmount = deposits.find(deposit => deposit.userId.equals(userId))?.amount || 0;

//         // Ensure the start price is the same as the total calculated bids minus deposit
//         if (item.startPrice) {
//           winnerUserId = userId;
//           break;
//         }
//       }

//       if (winnerBid && winnerUserId && winnerBid.userId.equals(winnerUserId)&&!item.notifiedWinner) {
//         // Notify the winner
//         const winnerNotification = new Notification({
//           userId: winnerBid.userId,
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//           itemId: item._id,
//         });
//         await winnerNotification.save();

//         // Emit real-time notification to the winner
//         notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
//           message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//         });
// console.log("object")
//         // Save the winner details
//         const winnerEntry = new Winner({
//           userId: winnerBid.userId,
//           itemId: item._id,
//           amount: winnerBid.amount,
//           status: 'winner',
//         });
//         await winnerEntry.save();
//         // Mark the item as notified for the winner
//         item.notifiedWinner = true;
//         item.status = 'completed'; // Ensure this is a valid status
//         await item.save();
//       }

//       // Notify all users about the auction end
//       const endNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
//           itemId: item._id,
//         });
//         return notification.save();
//       });
//       await Promise.all(endNotifications);

//       for (const deposit of deposits) {
//           const user = await User.findById(deposit.userId);
//         if (!winnerBid || !winnerBid.userId.equals(deposit.userId)||!subcategory.notifiedEnd) {

          

   
//             user.walletBalance += parseInt(deposit.amount);
//             user.walletTransactions.push({
//               amount: deposit.amount,
//               type: 'refund',
//               description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
//             });

//             console.log(`User ${user._id} wallet balance updated. New balance: ${user.walletBalance}`);
            
//             await user.save();
//             console.log(user)
//             console.log("user")

      

//           // Update deposit status to 'refunded'
//        /////////////////////////////////////////////////////////////////////////////////////////////
//           // deposit.status = 'refunded';
//           // await deposit.save({validateBeforeSave: false});
//           // console.log(deposit.userId._id)
//           // await user.save({ validateBeforeSave: false });
//      ///////////////////////////////////////////////////////////////
//           // Emit real-time notification about the refund

          
//           notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//             message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
//           });
//           const loserEntry = new Winner({
//             userId: deposit.userId,
//             itemId: item._id,
//             amount: deposit.amount,
//             status: 'loser',
//           });
//           await loserEntry.save();
//           item.notifiedLosers = true;
//           await item.save();
//         }
//       }

//     }

//     // Mark the subcategory as notified for the end
//     subcategory.notifiedEnd = true;
//     await subcategory.save();

//     // Emit real-time notification to all users about the auction end
//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has ended.`,
//       });

//     });

//   }
// };


// const setupNotificationInterval = (notificationNamespace) => {
//   setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
// };

// module.exports = {
//   createNotificationNamespace,
//   setupNotificationInterval,
// };

















// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   // Step 1: Check for auctions that are starting
//   const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });
// console.log(startingSubcategories)
//   for (const subcategory of startingSubcategories) {
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     // Send notification to each user with an approved deposit
//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//         itemId: subcategory._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(startNotifications);

//     // Mark the subcategory as notified for the start
//     subcategory.notifiedStart = true;
//     await subcategory.save();

//     // Emit real-time notification to each user
//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
//         subcategory: subcategory,
//       });
//     });
//   }

//   // Step 2: Check for auctions that are ending
//   const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });
//   for (const subcategory of endingSubcategories) {
//     const items = await Item.find({ subcategoryId: subcategory._id });
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     for (const item of items) {
//       // Find the highest bid for the item to determine the winner
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 });
//       const winnerBid = bids[0];

//       if (winnerBid) {
//         const userId = winnerBid.userId;
//         const depositAmount = deposits.find(deposit => deposit.userId.equals(userId))?.amount || 0;

//         // Calculate commission based on start price
//         const commission1 = item.startPrice * (item.commission1 / 100);
//         const commission2 = item.startPrice * (item.commission2 / 100);
//         const commission3 = item.startPrice * (item.commission3 / 100);
//         const totalAfterCommission = parseInt(item.startPrice) + commission1 + commission2 + commission3;
//         const winnerAmount = totalAfterCommission - depositAmount;

//         if (!item.notifiedWinner) {
//           // Notify the winner
//           const winnerNotification = new Notification({
//             userId: winnerBid.userId,
//             message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//             itemId: item._id,
//           });
//           await winnerNotification.save();

//           // Emit real-time notification to the winner
//           notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
//             message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//           });

//           // Save the winner details
//           const winnerEntry = new Winner({
//             userId: winnerBid.userId,
//             itemId: item._id,
//             amount: winnerAmount,
//             status: 'winner',
//           });
//           await winnerEntry.save();

//           // Mark the item as notified for the winner
//           item.notifiedWinner = true;
//           item.status = 'completed'; // Ensure this is a valid status
//           await item.save();
//         }
//       }

//       // Notify all users about the auction end
//       const endNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
//           itemId: item._id,
//         });
//         return notification.save();
//       });
//       await Promise.all(endNotifications);

//       for (const deposit of deposits) {
//         const user = await User.findById(deposit.userId);
//         if (!winnerBid || !winnerBid.userId.equals(deposit.userId) || !subcategory.notifiedEnd) {
//           user.walletBalance += parseInt(deposit.amount);
//           user.walletTransactions.push({
//             amount: deposit.amount,
//             type: 'refund',
//             description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
//           });

//           console.log(`User ${user._id} wallet balance updated. New balance: ${user.walletBalance}`);
//           await user.save();

//           // Update deposit status to 'refunded'
//           // deposit.status = 'refunded';
//           // await deposit.save({ validateBeforeSave: false });

//           // Emit real-time notification about the refund
//           notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//             message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
//           });

//           const loserEntry = new Winner({
//             userId: deposit.userId,
//             itemId: item._id,
//             amount: deposit.amount,
//             status: 'loser',
//           });
//           await loserEntry.save();
//           item.notifiedLosers = true;
//           await item.save();
//         }
//       }
//     }

//     // Mark the subcategory as notified for the end
//     subcategory.notifiedEnd = true;
//     await subcategory.save();

//     // Emit real-time notification to all users about the auction end
//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has ended.`,
//       });
//     });
//   }
// };

// const setupNotificationInterval = (notificationNamespace) => {
//   setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
// };

// module.exports = {
//   createNotificationNamespace,
//   setupNotificationInterval,
// };





// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   // Step 1: Check for auctions that are starting
//   const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const subcategory of startingSubcategories) {
//     const deposits = await Deposit.find({ item: subcategory._id });

//     // Send notification to each user with an approved deposit
//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for subcategory ${subcategory.name} has started.`,
//         itemId: subcategory._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(startNotifications);

//     // Mark the subcategory as notified for the start
//     subcategory.notifiedStart = true;
//     await subcategory.save();

//     // Emit real-time notification to each user
//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
//         subcategory: subcategory,
//       });
//     });
//   }

//   // Step 2: Check for auctions that are ending
//   const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });
//   for (const subcategory of endingSubcategories) {
//     const items = await Item.find({ subcategoryId: subcategory._id });
//     const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//     for (const item of items) {
//       // Find the highest bid for the item to determine the winner
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 });
//       const winnerBid = bids[0];

//       if (winnerBid) {
//         const userId = winnerBid.userId;
//         const depositAmount = deposits.find(deposit => deposit.userId.equals(userId))?.amount || 0;

//         // Calculate commission based on start price
//         const commission1 = item.startPrice * (item.commission1 / 100);
//         const commission2 = item.startPrice * (item.commission2 / 100);
//         const commission3 = item.startPrice * (item.commission3 / 100);
//         const totalAfterCommission = parseInt(item.startPrice) + commission1 + commission2 + commission3;
//         const winnerAmount = totalAfterCommission - depositAmount;
//         if (isNaN(winnerAmount)) {
//           console.error(`winnerAmount is NaN for item ${item._id}, user ${userId}`);
//           continue; // Skip this item if winnerAmount is NaN
//         }
//         if (!item.notifiedWinner) {
//           // Notify the winner
//           const winnerNotification = new Notification({
//             userId: winnerBid.userId,
            
//             message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//             itemId: item._id,
//           });
//           await winnerNotification.save();

//           // Emit real-time notification to the winner
//           notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
//             message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//           });

//           // Save the winner details
//           const winnerEntry = new Winner({
//             userId: winnerBid.userId,
//            subcategory:item.subcategoryId,
//             itemId: item._id,
//             amount: winnerAmount,
//             status: 'winner',
//           });
//           await winnerEntry.save();

//           // Update the winner's deposit status to 'winner'
//           const winnerDeposit = deposits.find(deposit => deposit.userId.equals(winnerBid.userId));
   
//           if (winnerDeposit) {
//             winnerDeposit.status = 'winner';
//             await winnerDeposit.save({ validateBeforeSave: false });
//           }

//           // Mark the item as notified for the winner
//           item.notifiedWinner = true;
//           item.status = 'completed'; // Ensure this is a valid status
//           await item.save();
//         }
//       }

//       // Refund all users except the winner
//       for (const deposit of deposits) {
//         const user = await User.findById(deposit.userId);
//         if (!winnerBid || !winnerBid.userId.equals(deposit.userId)) {
//           user.walletBalance += parseInt(deposit.amount);
//           user.walletTransactions.push({
//             amount: deposit.amount,
//             type: 'refund',
//             description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
//           });

//           console.log(`User ${user._id} wallet balance updated. New balance: ${user.walletBalance}`);
//           await user.save();

//           // Update deposit status to 'refunded'
//           // deposit.status = 'refunded';
//           // await deposit.save({ validateBeforeSave: false });

//           // Emit real-time notification about the refund
//           notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//             message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
//           });

//           const loserEntry = new Winner({
//             userId: deposit.userId,
//           subcategory:item.subcategoryId,

//             itemId: item._id,
//             amount: deposit.amount,
//             status: 'loser',
//           });
//           await loserEntry.save();
//           item.notifiedLosers = true;
//           await item.save();
//         }
//       }
//     }

//     // Mark the subcategory as notified for the end
//     subcategory.notifiedEnd = true;
//     await subcategory.save();

//     // Emit real-time notification to all users about the auction end
//     deposits.forEach(deposit => {
//       notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//         message: `The auction for subcategory ${subcategory.name} has ended.`,
//       });
//     });
//   }
// };

// const setupNotificationInterval = (notificationNamespace) => {
//   setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
// };

// module.exports = {
//   createNotificationNamespace,
//   setupNotificationInterval,
// };










// const { startSession } = require('mongoose');


// const SubcategoryResult = require('../models/SubcategoryResult');

// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   const session = await startSession();
//   session.startTransaction();

//   try {
//     // Step 1: Check for auctions that are starting
//     const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//     for (const subcategory of startingSubcategories) {
//       const deposits = await Deposit.find({ item: subcategory._id });

//       // Send notification to each user with an approved deposit
//       const startNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for subcategory ${subcategory.name} has started.`,
//           itemId: subcategory._id,
//         });
//         return notification.save();
//       });
//       await Promise.all(startNotifications);

//       // Mark the subcategory as notified for the start
//       subcategory.notifiedStart = true;
//       await subcategory.save({ session });

//       // Emit real-time notification to each user
//       deposits.forEach(deposit => {
//         notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//           message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
//           subcategory: subcategory,
//         });
//       });
//     }

//     // Step 2: Check for auctions that are ending

//     const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });


//     for (const subcategory of endingSubcategories) {
//       const items = await Item.find({ subcategoryId: subcategory._id });
//       const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//       for (const item of items) {
//         // Find the highest bid for the item to determine the winner
//         const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).session(session);
//         const winnerBid = bids[0];

//         if (winnerBid) {
//           const userId = winnerBid.userId;
//           const depositAmount = deposits.find(deposit => deposit.userId.equals(userId))?.amount || 0;

//           // Calculate commission based on start price
//           const commission1 = item.startPrice * (item.commission1 / 100);
//           const commission2 = item.startPrice * (item.commission2 / 100);
//           const commission3 = item.startPrice * (item.commission3 / 100);
//           const totalAfterCommission = parseInt(item.startPrice) + commission1 + commission2 + commission3;
//           const winnerAmount = totalAfterCommission - depositAmount;

//           if (isNaN(winnerAmount)) {
//             console.error(`winnerAmount is NaN for item ${item._id}, user ${userId}`);
//             continue; // Skip this item if winnerAmount is NaN
//           }

//           if (!item.notifiedWinner) {
//             // Notify the winner
//             const winnerNotification = new Notification({
//               userId: winnerBid.userId,
//               message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//               itemId: item._id,
//             });
//             await winnerNotification.save({ session });

//             // Emit real-time notification to the winner
//             notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
//               message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//             });

//             // Save the winner details
//             const winnerEntry = new Winner({
//               userId: winnerBid.userId,
//               subcategory: item.subcategoryId,
//               itemId: item._id,
//               amount: winnerAmount,
//               status: 'winner',
//             });
//             await winnerEntry.save({ session });

//             // Update the winner's deposit status to 'winner'
//             const winnerDeposit = deposits.find(deposit => deposit.userId.equals(winnerBid.userId));
//             if (winnerDeposit) {
//               winnerDeposit.status = 'winner';
//               await winnerDeposit.save({ validateBeforeSave: false, session });
//             }

//             // Mark the item as notified for the winner
//             item.notifiedWinner = true;
//             item.status = 'completed';
//             await item.save({ session });
//           }
//         }

//         // Refund all users except the winner
        
//         for (const deposit of deposits) {
//           const user = await User.findById(deposit.userId).session(session);
//           if (!winnerBid || !winnerBid.userId.equals(deposit.userId)) {
//             user.walletBalance += parseInt(deposit.amount);
//             user.walletTransactions.push({
//               amount: deposit.amount,
//               type: 'refund',
//               description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
//             });

//             console.log(`User ${user._id} wallet balance updated. New balance: ${user.walletBalance}`);
//             await user.save({ session,validateBeforeSave: false });

//             // Emit real-time notification about the refund
//             notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//               message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
//             });

//             const loserEntry = new Winner({
//               userId: deposit.userId,
//               subcategory: item.subcategoryId,
//               itemId: item._id,
//               amount: deposit.amount,
//               status: 'loser',
//             });
//             await loserEntry.save({ session });

//             item.notifiedLosers = true;
//             await item.save({ session });
//           }
//         }
//       }

//       // Mark the subcategory as notified for the end
//       subcategory.notifiedEnd = true;
//       await subcategory.save({ session });

//       // Emit real-time notification to all users about the auction end
//       deposits.forEach(deposit => {
//         notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//           message: `The auction for subcategory ${subcategory.name} has ended.`,
//         });
//       });
//     }

//     await session.commitTransaction();
//     session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Transaction aborted due to error:', error);
//   }

  // After processing the auctions, aggregate the results
  // await aggregateSubcategoryResults();
// };

// const aggregateSubcategoryResults = async () => {
//   try {
//     // Aggregate winners and losers by user and subcategory
//     const results = await Winner.aggregate([
//       {
//         $group: {
//           _id: { userId: "$userId", subcategory: "$subcategory", status: "$status" },
//           winnerIds: { $push: "$_id" },
//           totalAmount: { $sum: { $cond: { if: { $eq: ["$status", "winner"] }, then: "$amount", else: 0 } } },
//         }
//       },
//       {
//         $group: {
//           _id: { userId: "$_id.userId", subcategory: "$_id.subcategory" },
//           results: {
//             $push: {
//               status: "$_id.status",
//               winnerIds: "$winnerIds",
//               totalAmount: "$totalAmount"
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           userId: "$_id.userId",
//           subcategory: "$_id.subcategory",
//           results: 1
//         }
//       }
//     ]);

//     // Save the aggregated results to the SubcategoryResult collection
//     for (const result of results) {
//       for (const res of result.results) {
//         const subcategoryResult = new SubcategoryResult({
//           userId: result.userId,
//           subcategory: result.subcategory,
//           totalAmount: res.status === 'winner' ? res.totalAmount : null,
//           status: res.status,
//           results: res.winnerIds,
//         });
//         await subcategoryResult.save();
//       }
//     }

//   } catch (error) {
//     console.error('Error aggregating subcategory results:', error);
//   }
// };

// const setupNotificationInterval = (notificationNamespace) => {
//   setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
// };

// module.exports = {
//   createNotificationNamespace,
//   setupNotificationInterval,
//   notifyAuctionEvents
// };


















































// const { startSession } = require('mongoose');

// const SubcategoryResult = require('../models/SubcategoryResult');

// const notifyAuctionEvents = async (notificationNamespace) => {
//   const now = new Date();

//   const session = await startSession();
//   session.startTransaction();

//   try {
//     // Step 1: Check for auctions that are starting
//     const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//     for (const subcategory of startingSubcategories) {
//       const deposits = await Deposit.find({ item: subcategory._id });

//       // Send notification to each user with an approved deposit
//       const startNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for subcategory ${subcategory.name} has started.`,
//           itemId: subcategory._id,
//         });
//         return notification.save();
//       });
//       await Promise.all(startNotifications);

//       // Mark the subcategory as notified for the start
//       subcategory.notifiedStart = true;
//       await subcategory.save({ session });

//       // Emit real-time notification to each user
//       deposits.forEach(deposit => {
//         notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//           message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
//           subcategory: subcategory,
//         });
//       });
//     }

//     // Step 2: Check for auctions that are ending
//     const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });

//     for (const subcategory of endingSubcategories) {
//       const items = await Item.find({ subcategoryId: subcategory._id });
//       const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

//       for (const item of items) {
//         // Find the highest bid for the item to determine the winner
//         const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).session(session);
//         const winnerBid = bids[0];

//         if (winnerBid) {
//           const userId = winnerBid.userId;
//           const depositAmount = deposits.find(deposit => deposit.userId.equals(userId))?.amount || 0;

//           // Calculate commission based on start price
//           const commission1 = item.startPrice * (item.commission1 / 100);
//           const commission2 = item.startPrice * (item.commission2 / 100);
//           const commission3 = item.startPrice * (item.commission3 / 100);
//           const totalAfterCommission = parseInt(item.startPrice) + commission1 + commission2 + commission3;
//           const winnerAmount = totalAfterCommission - depositAmount;

//           if (isNaN(winnerAmount)) {
//             console.error(`winnerAmount is NaN for item ${item._id}, user ${userId}`);
//             continue; // Skip this item if winnerAmount is NaN
//           }

//           if (!item.notifiedWinner) {
//             // Notify the winner
//             const winnerNotification = new Notification({
//               userId: winnerBid.userId,
//               message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//               itemId: item._id,
//             });
//             await winnerNotification.save({ session });

//             // Emit real-time notification to the winner
//             notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
//               message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
//             });

//             // Save the winner details
//             const winnerEntry = new Winner({
//               userId: winnerBid.userId,
//               subcategory: item.subcategoryId,
//               itemId: item._id,
//               amount: winnerAmount,
//               status: 'winner',
//             });
//             await winnerEntry.save({ session });

//             // Update the winner's deposit status to 'winner'
//             const winnerDeposit = deposits.find(deposit => deposit.userId.equals(winnerBid.userId));
//             if (winnerDeposit) {
//               winnerDeposit.status = 'winner';
//               await winnerDeposit.save({ validateBeforeSave: false, session });
//             }

//             // Mark the item as notified for the winner
//             item.notifiedWinner = true;
//             item.status = 'completed';
//             await item.save({ session });
//           }
//         }

//         // Process all deposits to ensure losers are recorded
//         for (const deposit of deposits) {
//           const user = await User.findById(deposit.userId).session(session);
//           if (!winnerBid || !winnerBid.userId.equals(deposit.userId)) {
//             user.walletBalance += parseInt(deposit.amount);
//             user.walletTransactions.push({
//               amount: deposit.amount,
//               type: 'refund',
//               description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
//             });

//             console.log(`User ${user._id} wallet balance updated. New balance: ${user.walletBalance}`);
//             await user.save({ session, validateBeforeSave: false });

//             // Emit real-time notification about the refund
//             notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//               message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
//             });

//             const loserEntry = new Winner({
//               userId: deposit.userId,
//               subcategory: item.subcategoryId,
//               itemId: item._id,
//               amount: deposit.amount,
//               status: 'loser',
//             });
//             await loserEntry.save({ session });

//             item.notifiedLosers = true;
//             await item.save({ session });
//           }
//         }
//       }

//       // Mark the subcategory as notified for the end
//       subcategory.notifiedEnd = true;
//       await subcategory.save({ session });

//       // Emit real-time notification to all users about the auction end
//       deposits.forEach(deposit => {
//         notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
//           message: `The auction for subcategory ${subcategory.name} has ended.`,
//         });
//       });
//     }

//     await session.commitTransaction();
//     session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Transaction aborted due to error:', error);
//   }

//   // After processing the auctions, aggregate the results
//   // await aggregateSubcategoryResults();
// };

// const aggregateSubcategoryResults = async () => {
//   try {
//     // Aggregate winners and losers by user and subcategory
//     const results = await Winner.aggregate([
//       {
//         $group: {
//           _id: { userId: "$userId", subcategory: "$subcategory", status: "$status" },
//           winnerIds: { $push: "$_id" },
//           totalAmount: { $sum: { $cond: { if: { $eq: ["$status", "winner"] }, then: "$amount", else: 0 } } },
//         }
//       },
//       {
//         $group: {
//           _id: { userId: "$_id.userId", subcategory: "$_id.subcategory" },
//           results: {
//             $push: {
//               status: "$_id.status",
//               winnerIds: "$winnerIds",
//               totalAmount: "$totalAmount"
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           userId: "$_id.userId",
//           subcategory: "$_id.subcategory",
//           results: 1
//         }
//       }
//     ]);

//     // Save the aggregated results to the SubcategoryResult collection
//     for (const result of results) {
//       for (const res of result.results) {
//         const subcategoryResult = new SubcategoryResult({
//           userId: result.userId,
//           subcategory: result.subcategory,
//           totalAmount: res.status === 'winner' ? res.totalAmount : null,
//           status: res.status,
//           results: res.winnerIds,
//         });
//         await subcategoryResult.save();
//       }
//     }

//     console.log('Subcategory results aggregation completed.');
//   } catch (error) {
//     console.error('Error aggregating subcategory results:', error);
//   }
// };

// const setupNotificationInterval = (notificationNamespace) => {
//   // setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
// };

// module.exports = {
//   createNotificationNamespace,
//   setupNotificationInterval,
//   notifyAuctionEvents
// };



const { startSession } = require('mongoose');

const SubcategoryResult = require('../models/SubcategoryResult');

const notifyAuctionEvents = async (notificationNamespace) => {
  const now = new Date();
  const session = await startSession();
  session.startTransaction();

  try {
    await processStartingSubcategories(now, notificationNamespace, session);
    await processEndingSubcategories(now, notificationNamespace, session);
    
    await session.commitTransaction();
    session.endSession();
    await aggregateSubcategoryResults();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction aborted due to error:', error);
  }

};

const processStartingSubcategories = async (now, notificationNamespace, session) => {
  const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

  for (const subcategory of startingSubcategories) {
    const deposits = await Deposit.find({ item: subcategory._id });

    const startNotifications = deposits.map(deposit => {
      const notification = new Notification({
        userId: deposit.userId,
        message: `The auction for subcategory ${subcategory.name} has started.`,
        itemId: subcategory._id,
      });
      return notification.save();
    });

    await Promise.all(startNotifications);

    subcategory.notifiedStart = true;
    await subcategory.save({ session });

    deposits.forEach(deposit => {
      notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
        message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
        subcategory: subcategory,
      });
    });
  }
};

const processEndingSubcategories = async (now, notificationNamespace, session) => {
  const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });

  for (const subcategory of endingSubcategories) {
    const items = await Item.find({ subcategoryId: subcategory._id });

    for (const item of items) {
      const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).session(session);
      const winnerBid = bids[0];

      if (winnerBid) {
        await handleWinner(item, winnerBid, subcategory, notificationNamespace, session);
      }

      await handleLosers(item, winnerBid, subcategory, notificationNamespace, session);
    }

    subcategory.notifiedEnd = true;
    await subcategory.save({ session });

    const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });
    deposits.forEach(deposit => {
      notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
        message: `The auction for subcategory ${subcategory.name} has ended.`,
      });
    });
  }
};

const handleWinner = async (item, winnerBid, subcategory, notificationNamespace, session) => {
  const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });
  const depositAmount = deposits.find(deposit => deposit.userId.equals(winnerBid.userId))?.amount || 0;

  const commission1 = item.startPrice * (item.commission1 / 100);
  const commission2 = item.startPrice * (item.commission2 / 100);
  const commission3 = item.startPrice * (item.commission3 / 100);
  const totalAfterCommission = parseInt(item.startPrice) + commission1 + commission2 + commission3;
  const winnerAmount = totalAfterCommission - depositAmount;

  if (isNaN(winnerAmount)) {
    console.error(`winnerAmount is NaN for item ${item._id}, user ${winnerBid.userId}`);
    return;
  }

  if (!item.notifiedWinner) {
    const winnerNotification = new Notification({
      userId: winnerBid.userId,
      message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
      itemId: item._id,
    });
    await winnerNotification.save({ session });

    notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
      message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
    });

    const winnerEntry = new Winner({
      userId: winnerBid.userId,
      subcategory: item.subcategoryId,
      itemId: item._id,
      amount: winnerAmount,
      status: 'winner',
    });
    await winnerEntry.save({ session });

    const winnerDeposit = deposits.find(deposit => deposit.userId.equals(winnerBid.userId));
    if (winnerDeposit) {
      winnerDeposit.status = 'winner';
      await winnerDeposit.save({ validateBeforeSave: false, session });
    }

    item.notifiedWinner = true;
    item.status = 'completed';
    await item.save({ session });
  }
};

const handleLosers = async (item, winnerBid, subcategory, notificationNamespace, session) => {
  const results = await Bid.aggregate([
    {
      $match: { 
        item: item._id, 
        userId: { $ne: winnerBid.userId } // Ensure the winnerBid is excluded in the aggregation
      }
    },
    {
      $group: {
        _id: { userId: "$userId", item: "$item" },
        totalAmount: { $sum: "$amount" },
      }
    },
    {
      $sort: { totalAmount: -1 }
    },
    {
      $project: {
        totalAmount: 1
      }
    }
  ]);

  for (const result of results) {
    const deposit = await Deposit.findOne({ userId: result._id.userId, item: item._id, status: 'approved' }).session(session);
    const loserEntry = new Winner({
      userId: result._id.userId,
      subcategory: item.subcategoryId,
      itemId: item._id,
      amount: result.totalAmount,
      status: 'loser',
    });
    await loserEntry.save({ session });
    if (deposit) {
      const user = await User.findById(result._id.userId).session(session);

      user.walletBalance += parseInt(deposit.amount);
      user.walletTransactions.push({
        amount: deposit.amount,
        type: 'refund',
        description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
      });
//  Update deposit status to 'refunded'
deposit.status = 'refunded';
 await deposit.save({ validateBeforeSave: false });
      await user.save({ session, validateBeforeSave: false });

      notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
        message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
      });


    }
  }

  item.notifiedLosers = true;
  await item.save({ session });
};
const aggregateSubcategoryResults = async () => {
  try {
    // Find all unprocessed results
    const results = await Winner.aggregate([
      { $match: { processed: false } }, // Only include unprocessed results
      {
        $group: {
          _id: { userId: "$userId", subcategory: "$subcategory", status: "$status" },
          winnerIds: { $push: "$_id" },
          totalAmount: { $sum: { $cond: { if: { $eq: ["$status", "winner"] }, then: "$amount", else: 0 } } },
        }
      },
      {
        $group: {
          _id: { userId: "$_id.userId", subcategory: "$_id.subcategory" },
          results: {
            $push: {
              status: "$_id.status",
              winnerIds: "$winnerIds",
              totalAmount: "$totalAmount"
            }
          }
        }
      },
      {
        $project: {
          userId: "$_id.userId",
          subcategory: "$_id.subcategory",
          results: 1
        }
      }
    ]);

    for (const result of results) {
      for (const res of result.results) {
        const subcategoryResult = new SubcategoryResult({
          userId: result.userId,
          subcategory: result.subcategory,
          totalAmount: res.status === 'winner' ? res.totalAmount : null,
          status: res.status,
          results: res.winnerIds,
        });
        await subcategoryResult.save();

        // Mark processed winners as processed
        await Winner.updateMany(
          { _id: { $in: res.winnerIds } },
          { $set: { processed: true } }
        );
      }
    }

    console.log('Subcategory results aggregation completed.');
  } catch (error) {
    console.error('Error aggregating subcategory results:', error);
  }
};


const setupNotificationInterval = (notificationNamespace) => {
  setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
};

module.exports = {
  createNotificationNamespace,
  setupNotificationInterval,
  notifyAuctionEvents
};

