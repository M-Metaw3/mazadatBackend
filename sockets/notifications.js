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














const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subcategory = require('../models/subcategory');
const Item = require('../models/item');
const Bid = require('../models/Bid');
const Deposit = require('../models/Deposit');
const Notification = require('../models/notification');

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.blocked || !user.verified) {
      return next(new Error('Authentication error'));
    }
    socket.userId = user._id;
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

const notifyAuctionEvents = async (notificationNamespace) => {
  const now = new Date();

  // Check for starting auctions
  const startingSubcategories = await Subcategory.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });
  for (const subcategory of startingSubcategories) {
    const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

    const startNotifications = deposits.map(deposit => {
      const notification = new Notification({
        userId: deposit.userId,
        message: `The auction for subcategory ${subcategory.name} has started.`,
        subcategoryId: subcategory._id,
      });
      return notification.save();
    });

    await Promise.all(startNotifications);

    subcategory.notifiedStart = true;
    await subcategory.save();

    deposits.forEach(deposit => {
      notificationNamespace.to(`user_${deposit.userId}`).emit('auctionStarted', {
        message: `The auction for subcategory ${subcategory.name} has started.`,
      });
    });
  }

  // Check for ending auctions
  const endingSubcategories = await Subcategory.find({ endDate: { $lte: now } });
  for (const subcategory of endingSubcategories) {
    const items = await Item.find({ subcategoryId: subcategory._id });
    const deposits = await Deposit.find({ item: subcategory._id, status: 'approved' });

    for (const item of items) {
      const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
      const winnerBid = bids[0];

      if (winnerBid) {
        const winnerNotification = new Notification({
          userId: winnerBid.userId,
          message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
          itemId: item._id,
        });
        await winnerNotification.save();

        notificationNamespace.to(`user_${winnerBid.userId}`).emit('auctionEnded', {
          message: `Congratulations! You have won the auction for item ${item.name} in subcategory ${subcategory.name} with a bid of ${winnerBid.amount}.`,
        });
      }

      const endNotifications = deposits.map(deposit => {
        const notification = new Notification({
          userId: deposit.userId,
          message: `The auction for item ${item.name} in subcategory ${subcategory.name} has ended.`,
          itemId: item._id,
        });
        return notification.save();
      });

      await Promise.all(endNotifications);
    }

    deposits.forEach(deposit => {
      notificationNamespace.to(`user_${deposit.userId}`).emit('auctionEnded', {
        message: `The auction for subcategory ${subcategory.name} has ended.`,
      });
    });
  }
};

const setupNotificationInterval = (notificationNamespace) => {
  setInterval(() => notifyAuctionEvents(notificationNamespace), 60 * 1000);
};

module.exports = {
  createNotificationNamespace,
  setupNotificationInterval,
};

