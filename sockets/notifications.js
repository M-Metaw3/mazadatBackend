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




const notifyAuctionEvents = async (notificationNamespace) => {
  const now = new Date();

  // Step 1: Check for auctions that are starting
  const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

  for (const subcategory of startingSubcategories) {
    const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

    // Send notification to each user with an approved deposit
    const startNotifications = deposits.map(deposit => {
      const notification = new Notification({
        userId: deposit.userId,
        message: `The auction for subcategory ${subcategory.name} has started.`,
        itemId: subcategory._id,
      });
      return notification.save();
    });
    await Promise.all(startNotifications);

    // Mark the subcategory as notified for the start
    subcategory.notifiedStart = true;
    await subcategory.save();

    // Emit real-time notification to each user
    deposits.forEach(deposit => {
      notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
        message: `The auction for subcategory ${subcategory.name} has started and will end at ${subcategory.endDate.toLocaleTimeString()}.`,
        subcategory: subcategory,
      });
    });
  }

  // Step 2: Check for auctions that are ending
  const endingSubcategories = await Subcategory.find({ endDate: { $lte: now }, notifiedEnd: { $ne: true } });
  for (const subcategory of endingSubcategories) {
    const items = await Item.find({ subcategoryId: subcategory._id });
    const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

    for (const item of items) {
      // Find the highest bid for the item to determine the winner
      const bids = await Bid.find({ item: item._id }).sort({ amount: -1 });
      const winnerBid = bids[0];

      // Calculate total bids for each user
      const userBids = {};
      bids.forEach(bid => {
        if (!userBids[bid.userId]) userBids[bid.userId] = 0;
        userBids[bid.userId] += bid.amount;
      });

      // Check if the start price equals the sum of all bids for each user
      let winnerUserId = null;
      for (const [userId, totalBid] of Object.entries(userBids)) {
        // Calculate commission (assuming commission1, commission2, commission3 are defined)
        const commission1 = totalBid * 0.01;
        const commission2 = totalBid * 0.02;
        const commission3 = totalBid * 0.03;
        const totalAfterCommission = totalBid - (commission1 + commission2 + commission3);
        const depositAmount = deposits.find(deposit => deposit.userId.equals(userId))?.amount || 0;

        // Ensure the start price is the same as the total calculated bids minus deposit
        if (item.startPrice) {
          winnerUserId = userId;
          break;
        }
      }

      if (winnerBid && winnerUserId && winnerBid.userId.equals(winnerUserId)&&!item.notifiedWinner) {
        // Notify the winner
        const winnerNotification = new Notification({
          userId: winnerBid.userId,
          message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
          itemId: item._id,
        });
        await winnerNotification.save();

        // Emit real-time notification to the winner
        notificationNamespace.to(`user_${winnerBid.userId}`).emit('notification', {
          message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
        });
console.log("object")
        // Save the winner details
        const winnerEntry = new Winner({
          userId: winnerBid.userId,
          itemId: item._id,
          amount: winnerBid.amount,
          status: 'winner',
        });
        await winnerEntry.save();
// console.log(winnerEntry)
// console.log("winnerEntry")

        // Mark the item as notified for the winner
        item.notifiedWinner = true;
        item.status = 'completed'; // Ensure this is a valid status
        await item.save();
      }

      // Notify all users about the auction end
      const endNotifications = deposits.map(deposit => {
        const notification = new Notification({
          userId: deposit.userId,
          message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
          itemId: item._id,
        });
        return notification.save();
      });
      await Promise.all(endNotifications);

      for (const deposit of deposits) {
        if (!winnerBid || !winnerBid.userId.equals(deposit.userId)||!subcategory.notifiedEnd) {
          // Process refund for users who didn't win
          const user = await User.findById(deposit.userId);
          
          
          // if (typeof deposit.amount === 'number' && !isNaN(deposit.amount)) {
            user.walletBalance += parseInt(deposit.amount);
            user.walletTransactions.push({
              amount: deposit.amount,
              type: 'refund',
              description: `Refund for item ${item.name} in subcategory ${subcategory.name}`,
            });

            console.log(`User ${user._id} wallet balance updated. New balance: ${user.walletBalance}`);
            
            await user.save();
            console.log(user)
            console.log("user")

          // } else {
          //   console.error(`Invalid deposit amount for user ${deposit.userId}: ${deposit.amount}`);
          // }

          // Update deposit status to 'refunded'
       
          deposit.status = 'refunded';
          await deposit.save({validateBeforeSave: false});
          console.log(deposit.userId._id)
          // Emit real-time notification about the refund

          
          notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
            message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended. Your deposit has been refunded.`,
          });
          const loserEntry = new Winner({
            userId: deposit.userId,
            itemId: item._id,
            amount: deposit.amount,
            status: 'loser',
          });
          await loserEntry.save();
          item.notifiedLosers = true;
          await item.save();
        }
      }

    }

    // Mark the subcategory as notified for the end
    subcategory.notifiedEnd = true;
    await subcategory.save();

    // Emit real-time notification to all users about the auction end
    deposits.forEach(deposit => {
      notificationNamespace.to(`user_${deposit.userId._id}`).emit('notification', {
        message: `The auction for subcategory ${subcategory.name} has ended.`,
      });

    });

  }
};


const setupNotificationInterval = (notificationNamespace) => {
  setInterval(() => notifyAuctionEvents(notificationNamespace), 10 * 1000);
};

module.exports = {
  createNotificationNamespace,
  setupNotificationInterval,
};















