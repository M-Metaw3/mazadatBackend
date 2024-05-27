const factory = require('../utils/apiFactory');



// const createMulterUpload = (io) => {
//     io.on('connection', (socket) => {
//         console.log('Client connected');
//         socket.on('bid', async (a) => {
//   socket.join(a.sender)
//   console.log(a)
//   const deposite = await new Bid({
//     item: a.sender,
//     userId: a.user,
//     amount: a.message
//   })
// await deposite.save()
// const items = await i.findById(deposite.item);
// items.startPrice += deposite.amount;
// await items.save()
// console.log('deposite',items)
//   io.to(a.sender).emit('bidocuures', items)

// })

// socket.on('getitem', async (idofitem) => {
//   console.log('idofitem',idofitem)
//   try {
// socket.join(idofitem)
//     const items = await i.findById(idofitem);
//     console.log('Items:', items);

//   //   const changeStream = i.watch();
//   //    changeStream.on('change', (change) => {
//   //   console.log('Change:', change);
//   //   socket.emit('itemChange', change); // Emit the change to connected clients
//   // });
//     socket.emit('items', items)
//   } catch (error) {
//     console.error('Error getting items:', error);
//     return { error: 'Failed to retrieve items' };
//   }
// });


//         socket.on('disconnect', () => {
//           console.log('Client disconnected');
//         });
//       })
// };



// const Bid = require('../models/Bid'); // Adjust the path as needed
// const Item = require('../models/item'); // Adjust the path as needed
// const Deposit = require('../models/Deposit'); // Adjust the path as needed
// const Notification = require('../models/notification')
// const checkDepositAndItemStatus = async (socket, next) => {
//   try {
//     const { userId, itemId } = socket.handshake.query;

//     // Check if the user has paid the deposit
//     const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
//     if (!deposit) {
//       return next(new Error('User has not paid the deposit for this item.'));
//     }

//     // Check if the item is still active
//     const item = await Item.findById(itemId);
//     if (!item || item.endDate <= new Date()) {
//       return next(new Error('Auction for this item has ended.'));
//     }

//     // Store item and user info in socket
//     socket.item = item;
//     socket.userId = userId;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };



// const createMulterUpload = (io) => {
//   const auctionNamespace = io.of('/auction');
//   auctionNamespace.use(checkDepositAndItemStatus);
//   auctionNamespace.on('connection', (socket) => {
//     console.log('User connected:', socket.userId);
  
//     socket.join(socket.item._id.toString()); // Join room for the specific item
  
//     socket.on('placeBid', async (bidData) => {
//       try {
//         const { itemId, amount } = bidData;
  
//         // Validate the bid amount
//         if (amount < socket.item.startPrice + socket.item.currentMinBidIncrement) {
//           socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${socket.item.currentMinBidIncrement}).`);
//           return;
//         }
  
//         // Create a new bid
//         const bid = new Bid({
//           userId: socket.userId,
//           item: itemId,
//           amount,
//           bidTime: new Date(),
//         });
//         await bid.save();
  
//         // Update the item's current price
//         socket.item.startPrice = amount;
  
//         // Check if the bid was placed in the last 10 minutes of the auction
//         const now = new Date();
//         const timeRemaining = socket.item.endDate - now;
//         const tenMinutes = 10 * 60 * 1000;
//         const twentyMinutes = 20 * 60 * 1000;
  
//         if (timeRemaining <= tenMinutes) {
//           socket.item.endDate = new Date(now.getTime() + twentyMinutes);
  
//           // Double the minimum bid increment
//           socket.item.currentMinBidIncrement *= 2;
  
//           // Notify all users about the new end time and min bid increment
//           auctionNamespace.to(itemId).emit('auctionExtended', {
//             newEndTime: socket.item.endDate,
//             newMinBidIncrement: socket.item.currentMinBidIncrement
//           });
//         }
  
//         await socket.item.save();
  
//         // Notify all users who have deposited for this item about the new bid
//         const deposits = await Deposit.find({ item: itemId, status: 'approved' });
//         const notificationPromises = deposits.map(deposit => {
//           const notification = new Notification({
//             userId: deposit.userId,
//             message: `A new bid of ${amount} has been placed on item ${socket.item.name}`,
//             itemId,
//           });
//           return notification.save();
//         });
//         await Promise.all(notificationPromises);
  
//         auctionNamespace.to(itemId).emit('newBid', { userId: socket.userId, amount });
  
//       } catch (error) {
//         socket.emit('bidError', error.message);
//       }
//     });
  
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.userId);
//     });
//   });
//   };



//   const checkAuctionEnd = async () => {
//     const items = await Item.find({ endDate: { $lte: new Date() } });
//     for (const item of items) {
//       const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//       const winnerBid = bids[0];
//       const deposits = await Deposit.find({ item: item._id, status: 'approved' });
  
//       if (winnerBid) {
//         const winnerNotification = new Notification({
//           userId: winnerBid.userId,
//           message: `Congratulations! You have won the auction for item ${item.name} with a bid of ${winnerBid.amount}.`,
//           itemId: item._id,
//         });
//         await winnerNotification.save();
  
//         auctionNamespace.to(item._id.toString()).emit('auctionEnded', {
//           message: `Auction for item ${item.name} has ended. Winner: ${winnerBid.userId}, Amount: ${winnerBid.amount}`,
//         });
//       }
  
//       const endNotifications = deposits.map(deposit => {
//         const notification = new Notification({
//           userId: deposit.userId,
//           message: `The auction for item ${item.name} has ended.`,
//           itemId: item._id,
//         });
//         return notification.save();
//       });
//       await Promise.all(endNotifications);
//     }
//   };
  
//   // Schedule auction end check every minute
//   setInterval(checkAuctionEnd, 60 * 1000);

// module.exports = createMulterUpload;













// const Bid = require('../models/Bid'); // Adjust the path as needed
// const Item = require('../models/item'); // Adjust the path as needed
// const Deposit = require('../models/Deposit'); // Adjust the path as needed
// const Notification = require('../models/notification');
// const mongoose = require('mongoose');
// let auctionNamespace;

// const checkDepositAndItemStatus = async (socket, next) => {
//   try {
//     const { userId, itemId } = socket.handshake.query;

//     // Check if the user has paid the deposit
//     const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
//     if (!deposit) {
//       return next(new Error('User has not paid the deposit for this item.'));
//     }

//     // Check if the item is still active
//     const item = await Item.findById(itemId);
//     if (!item || item.endDate <= new Date()) {
//       return next(new Error('Auction for this item has ended.'));
//     }

//     // Store item and user info in socket
//     socket.item = item;
//     socket.userId = userId;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// const createAuctionNamespace = (io) => {
//   auctionNamespace = io.of('/auction');
//   auctionNamespace.use(checkDepositAndItemStatus);

//   auctionNamespace.on('connection', (socket) => {
//     console.log('User connected:', socket.userId);

//     // Join room for the specific item
//     socket.join(socket.item._id.toString());

//     // Notify the user with item details and current users in the room
//     const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//     const userCount = room ? room.size : 0;
//     const bidCount = Bid.countDocuments({ item: socket.item._id });

//     socket.emit('itemDetails', {
//       item: socket.item,
//       userCount,
//       bidCount
//     });

//     // Notify other users about the new connection
//     auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });

//     socket.on('placeBid', async (bidData) => {
//       try {
//         const { itemId, amount } = bidData;
//         const item = await Item.findById(itemId);

//         // Validate the bid amount
//         if (amount < item.startPrice + item.minBidIncrement) {
//           socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${item.minBidIncrement}).`);
//           return;
//         }

//         // Create a new bid
//         const bid = new Bid({
//           userId: socket.userId,
//           item: itemId,
//           amount,
//           bidTime: new Date(),
//         });
//         await bid.save();

//         // Update the item's current price
//         item.startPrice = amount;

//         // Check if the bid was placed in the last 10 minutes of the auction
//         const now = new Date();
//         const timeRemaining = item.endDate - now;
//         const tenMinutes = 10 * 60 * 1000;
//         const twentyMinutes = 20 * 60 * 1000;

//         if (timeRemaining <= tenMinutes) {
//           item.endDate = new Date(now.getTime() + twentyMinutes);

//           // Double the minimum bid increment, except the first time
//           if (!socket.firstExtensionDone) {
//             socket.firstExtensionDone = true;
//           } else {
//             item.minBidIncrement *= 2;
//           }

//           // Notify all users about the new end time and min bid increment
//           auctionNamespace.to(itemId).emit('auctionExtended', {
//             newEndTime: item.endDate,
//             newMinBidIncrement: item.minBidIncrement
//           });
//         }

//         await item.save();

//         // Notify all users who have deposited for this item about the new bid
//         const deposits = await Deposit.find({ item: itemId, status: 'approved' });
//         const notificationPromises = deposits.map(deposit => {
//           const notification = new Notification({
//             userId: deposit.userId,
//             message: `A new bid of ${amount} has been placed on item ${item.name}`,
//             itemId,
//           });
//           return notification.save();
//         });
//         await Promise.all(notificationPromises);

//         auctionNamespace.to(itemId).emit('newBid', { userId: socket.userId, amount });

//       } catch (error) {
//         socket.emit('bidError', error.message);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.userId);

//       // Update the user count in the room
//       const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//       const userCount = room ? room.size : 0;
//       auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//     });
//   });
// };

// const checkAuctionEnd = async () => {
//   const items = await Item.find({ endDate: { $lte: new Date() } });
//   for (const item of items) {
//     const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//     const winnerBid = bids[0];
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     if (winnerBid) {
//       const winnerNotification = new Notification({
//         userId: winnerBid.userId,
//         message: `Congratulations! You have won the auction for item ${item.name} with a bid of ${winnerBid.amount}.`,
//         itemId: item._id,
//       });
//       await winnerNotification.save();

//       auctionNamespace.to(item._id.toString()).emit('auctionEnded', {
//         message: `Auction for item ${item.name} has ended. Winner: ${winnerBid.userId}, Amount: ${winnerBid.amount}`,
//       });
//     }

//     const endNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has ended.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(endNotifications);
//   }
// };

// // Schedule auction end check every minute
// setInterval(checkAuctionEnd, 60 * 1000);

// module.exports = createAuctionNamespace;


// const jwt = require('jsonwebtoken');
// const Bid = require('../models/Bid');
// const Item = require('../models/item');
// const Deposit = require('../models/Deposit');
// const Notification = require('../models/notification');
// const mongoose = require('mongoose');
// let auctionNamespace;

// const checkDepositAndItemStatus = async (socket, next) => {
//   try {
//     const token = socket.handshake.query.token;
//     const { userId, itemId } = socket.handshake.query;

//     if (!token) {
//       return next(new Error('Authentication token is required.'));
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err) {
//         return next(new Error('Invalid token.'));
//       }

//       // Ensure the decoded user ID matches the provided user ID
//       if (decoded.userId !== userId) {
//         return next(new Error('User ID does not match token.'));
//       }

//       // Check if the user has paid the deposit
//       const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
//       if (!deposit) {
//         return next(new Error('User has not paid the deposit for this item.'));
//       }

//       // Check if the item is still active and has started
//       const item = await Item.findById(itemId);
//       const now = new Date();
//       if (!item) {
//         return next(new Error('Item not found.'));
//       }
//       if (item.startDate > now) {
//         return next(new Error('Auction for this item has not started yet.'));
//       }
//       if (item.endDate <= now) {
//         return next(new Error('Auction for this item has ended.'));
//       }

//       // Store item and user info in socket
//       socket.item = item;
//       socket.userId = userId;
//       next();
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// const notifyItemStart = async () => {
//   const now = new Date();
//   const items = await Item.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const item of items) {
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has started.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });

//     await Promise.all(startNotifications);

//     // Mark the item as notified
//     item.notifiedStart = true;
//     await item.save();

//     // Notify all users in the room
//     auctionNamespace.to(item._id.toString()).emit('itemStarted', {
//       message: `The auction for item ${item.name} has started.`,
//     });
//   }
// };

// // Schedule item start check every minute
// setInterval(notifyItemStart, 60 * 1000);



// const createAuctionNamespace = (io) => {
//   auctionNamespace = io.of('/auction');
//   auctionNamespace.use(checkDepositAndItemStatus);

//   auctionNamespace.on('connection', (socket) => {
//     console.log('User connected:', socket.userId);

//     socket.join(socket.item._id.toString());

//     const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//     const userCount = room ? room.size : 0;
//     const bidCount = Bid.countDocuments({ item: socket.item._id });

//     socket.emit('itemDetails', {
//       item: socket.item,
//       userCount,
//       bidCount
//     });

//     auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });

//     socket.on('placeBid', async (bidData) => {
//       try {
//         const { itemId, amount } = bidData;
//         const item = await Item.findById(itemId);

//         if (amount < item.startPrice + item.minBidIncrement) {
//           socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${item.minBidIncrement}).`);
//           return;
//         }

//         const bid = new Bid({
//           userId: socket.userId,
//           item: itemId,
//           amount,
//           bidTime: new Date(),
//         });
//         await bid.save();

//         item.startPrice = amount;

//         const now = new Date();
//         const timeRemaining = item.endDate - now;
//         const tenMinutes = 10 * 60 * 1000;
//         const twentyMinutes = 20 * 60 * 1000;

//         if (timeRemaining <= tenMinutes) {
//           item.endDate = new Date(now.getTime() + twentyMinutes);

//           if (!socket.firstExtensionDone) {
//             socket.firstExtensionDone = true;
//           } else {
//             item.minBidIncrement *= 2;
//           }

//           auctionNamespace.to(itemId).emit('auctionExtended', {
//             newEndTime: item.endDate,
//             newMinBidIncrement: item.minBidIncrement
//           });
//         }

//         await item.save();

//         const deposits = await Deposit.find({ item: itemId, status: 'approved' });
//         const notificationPromises = deposits.map(deposit => {
//           const notification = new Notification({
//             userId: deposit.userId,
//             message: `A new bid of ${amount} has been placed on item ${item.name}`,
//             itemId,
//           });
//           return notification.save();
//         });
//         await Promise.all(notificationPromises);

//         auctionNamespace.to(itemId).emit('newBid', { userId: socket.userId, amount });

//       } catch (error) {
//         socket.emit('bidError', error.message);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.userId);

//       const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//       const userCount = room ? room.size : 0;
//       auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//     });
//   });
// };

// const checkAuctionEnd = async () => {
//   const items = await Item.find({ endDate: { $lte: new Date() } });
//   for (const item of items) {
//     const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//     const winnerBid = bids[0];
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     if (winnerBid) {
//       const winnerNotification = new Notification({
//         userId: winnerBid.userId,
//         message: `Congratulations! You have won the auction for item ${item.name} with a bid of ${winnerBid.amount}.`,
//         itemId: item._id,
//       });
//       await winnerNotification.save();

//       auctionNamespace.to(item._id.toString()).emit('auctionEnded', {
//         message: `Auction for item ${item.name} has ended. Winner: ${winnerBid.userId}, Amount: ${winnerBid.amount}`,
//       });
//     }

//     const endNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has ended.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(endNotifications);
//   }
// };

// setInterval(checkAuctionEnd, 60 * 1000);

// module.exports = createAuctionNamespace;























// const jwt = require('jsonwebtoken');
// const Bid = require('../models/Bid');
// const Item = require('../models/item');
// const Deposit = require('../models/Deposit');
// const Notification = require('../models/notification');
// const mongoose = require('mongoose');
// let auctionNamespace;

// const checkDepositAndItemStatus = async (socket, next) => {
//   try {
//     // const token = socket.handshake.query.token;
//     const { userId, itemId } = socket.handshake.auth;

//     // if (!token) {
//     //   return next(new Error('Authentication token is required.'));
//     // }




//     // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//     //   if (err) {
//     //     return next(new Error('Invalid token.'));
//     //   }

//     //   // Ensure the decoded user ID matches the provided user ID
//     //   if (decoded.userId !== userId) {
//     //     return next(new Error('User ID does not match token.'));
//     //   }

//     //   // Check if the user has paid the deposit
//     //   const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
//     //   if (!deposit) {
//     //     return next(new Error('User has not paid the deposit for this item.'));
//     //   }

//     //   // Check if the item is still active and has started
//     //   const item = await Item.findById(itemId);
//     //   const now = new Date();
//     //   if (!item) {
//     //     return next(new Error('Item not found.'));
//     //   }
//     //   if (item.startDate > now) {
//     //     return next(new Error('Auction for this item has not started yet.'));
//     //   }
//     //   if (item.endDate <= now) {
//     //     return next(new Error('Auction for this item has ended.'));
//     //   }

//     //   // Store item and user info in socket
//     //   socket.item = item;
//     //   socket.userId = userId;
//     //   next();
//     // });
//     // Verify the token



//       // Check if the user has paid the deposit
//       const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
//       console.log(deposit)
//       if (!deposit) {
//         return next(new Error('User has not paid the deposit for this item.'));
//       }

//       // Check if the item is still active and has started
//       const item = await Item.findById(itemId);
//       const now = new Date();
//       if (!item) {
//         return next(new Error('Item not found.'));
//       }
//       if (item.startDate > now) {
//         return next(new Error('Auction for this item has not started yet.'));
//       }
//       if (item.endDate <= now) {
//         return next(new Error('Auction for this item has ended.'));
//       }

//       // Store item and user info in socket
//       socket.item = item;
//       socket.userId = userId;
//       next();
    
//   } catch (error) {
//     next(error);
//   }
// };



// const notifyItemStart = async () => {
//   const now = new Date();
//   const items = await Item.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const item of items) {
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has started.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });

//     await Promise.all(startNotifications);

//     // Mark the item as notified
//     item.notifiedStart = true;
//     await item.save();

//     // Notify all users in the room
//     auctionNamespace.to(item._id.toString()).emit('itemStarted', {
//       message: `The auction for item ${item.name} has started.`,
//     });
//   }
// };

// // Schedule item start check every minute
// setInterval(notifyItemStart, 60 * 1000);



// const createAuctionNamespace = (io) => {
//   auctionNamespace = io.of('/auction');
//   auctionNamespace.use(checkDepositAndItemStatus);

//   auctionNamespace.on('connection', (socket) => {
//     console.log('User connected:', socket.userId);

//     socket.join(socket.item._id.toString());

//     const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//     const userCount = room ? room.size : 0;
//     const bidCount = Bid.countDocuments({ item: socket.item._id });

//     socket.emit('itemDetails', {
//       item: socket.item,
//       userCount,
//       bidCount
//     });

//     auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });

//     socket.on('placeBid', async (bidData) => {
//       try {
//         const { itemId, amount } = bidData;
//         const item = await Item.findById(itemId);

//         if (amount < item.startPrice + item.minBidIncrement) {
//           socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${item.minBidIncrement}).`);
//           return;
//         }

//         const bid = new Bid({
//           userId: socket.userId,
//           item: itemId,
//           amount,
//           bidTime: new Date(),
//         });
//         await bid.save();

//         item.startPrice = amount;

//         const now = new Date();
//         const timeRemaining = item.endDate - now;
//         const tenMinutes = 10 * 60 * 1000;
//         const twentyMinutes = 20 * 60 * 1000;

//         if (timeRemaining <= tenMinutes) {
//           item.endDate = new Date(now.getTime() + twentyMinutes);

//           if (!socket.firstExtensionDone) {
//             socket.firstExtensionDone = true;
//           } else {
//             item.minBidIncrement *= 2;
//           }

//           auctionNamespace.to(itemId).emit('auctionExtended', {
//             newEndTime: item.endDate,
//             newMinBidIncrement: item.minBidIncrement
//           });
//         }

//         await item.save();

//         const deposits = await Deposit.find({ item: itemId, status: 'approved' });
//         const notificationPromises = deposits.map(deposit => {
//           const notification = new Notification({
//             userId: deposit.userId,
//             message: `A new bid of ${amount} has been placed on item ${item.name}`,
//             itemId,
//           });
//           return notification.save();
//         });
//         await Promise.all(notificationPromises);

//         auctionNamespace.to(itemId).emit('newBid', { userId: socket.userId, amount });

//       } catch (error) {
//         socket.emit('bidError', error.message);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.userId);

//       const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//       const userCount = room ? room.size : 0;
//       auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//     });
//   });
// };

// const checkAuctionEnd = async () => {
//   const items = await Item.find({ endDate: { $lte: new Date() } });
//   for (const item of items) {
//     const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//     const winnerBid = bids[0];
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     if (winnerBid) {
//       const winnerNotification = new Notification({
//         userId: winnerBid.userId,
//         message: `Congratulations! You have won the auction for item ${item.name} with a bid of ${winnerBid.amount}.`,
//         itemId: item._id,
//       });
//       await winnerNotification.save();

//       auctionNamespace.to(item._id.toString()).emit('auctionEnded', {
//         message: `Auction for item ${item.name} has ended. Winner: ${winnerBid.userId}, Amount: ${winnerBid.amount}`,
//       });
//     }

//     const endNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has ended.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(endNotifications);
//   }
// };

// setInterval(checkAuctionEnd, 60 * 1000);

// module.exports = createAuctionNamespace;
















// const jwt = require('jsonwebtoken');
// const Bid = require('../models/Bid');
// const Item = require('../models/item');
// const Deposit = require('../models/Deposit');
// const Notification = require('../models/notification');
// const mongoose = require('mongoose');

// let auctionNamespace;

// const checkDepositAndItemStatus = async (socket, next) => {
//   try {
//     const { userId, itemId } = socket.handshake.auth;

//     const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
//     if (!deposit) {
//       return next(new Error('User has not paid the deposit for this item.'));
//     }

//     const item = await Item.findById(itemId);
//     const now = new Date();
//     if (!item) {
//       return next(new Error('Item not found.'));
//     }
//     if (item.startDate > now) {
//       return next(new Error('Auction for this item has not started yet.'));
//     }
//     if (item.endDate <= now) {
//       return next(new Error('Auction for this item has ended.'));
//     }

//     socket.item = item;
//     socket.userId = userId;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// const notifyItemStart = async () => {
//   const now = new Date();
//   const items = await Item.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const item of items) {
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has started.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });

//     await Promise.all(startNotifications);

//     item.notifiedStart = true;
//     await item.save();

//     auctionNamespace.to(item._id.toString()).emit('itemStarted', {
//       message: `The auction for item ${item.name} has started.`,
//     });
//   }
// };

// const createAuctionNamespace = (io) => {
//   auctionNamespace = io.of('/auction');
//   auctionNamespace.use(checkDepositAndItemStatus);

//   auctionNamespace.on('connection', async (socket) => {
//     console.log('User connected:', socket.userId);

//     socket.join(socket.item._id.toString());

//     const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//     const userCount = room ? room.size : 0;
//     const bidCount = await Bid.countDocuments({ item: socket.item._id });

//     socket.emit('itemDetails', {
//       item: socket.item,
//       userCount,
//       bidCount
//     });

//     auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//     auctionNamespace.to(socket.item._id.toString()).emit('usercount', { userCount });


//     socket.on('placeBid', async (bidData) => {
//       try {
//         const { itemId, amount } = bidData;
//         const item = await Item.findById(itemId);

//         if (amount < item.startPrice + item.minBidIncrement) {
//           socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${item.minBidIncrement}).`);
//           return;
//         }

//         const bid = new Bid({
//           userId: socket.userId,
//           item: itemId,
//           amount,
//           bidTime: new Date(),
//         });
//         await bid.save();

//         item.startPrice = amount;

//         const now = new Date();
//         const timeRemaining = item.endDate - now;
//         const tenMinutes = 10 * 60 * 1000;
//         const twentyMinutes = 20 * 60 * 1000;

//         if (timeRemaining <= tenMinutes) {
//           item.endDate = new Date(now.getTime() + twentyMinutes);

//           if (!socket.firstExtensionDone) {
//             socket.firstExtensionDone = true;
//           } else {
//             item.minBidIncrement *= 2;
//           }

//           auctionNamespace.to(itemId).emit('auctionExtended', {
//             newEndTime: item.endDate,
//             newMinBidIncrement: item.minBidIncrement
//           });
//         }

//         await item.save();

//         const deposits = await Deposit.find({ item: itemId, status: 'approved' });
//         const notificationPromises = deposits.map(deposit => {
//           const notification = new Notification({
//             userId: deposit.userId,
//             message: `A new bid of ${amount} has been placed on item ${item.name}`,
//             itemId,
//           });
//           return notification.save();
//         });
//         await Promise.all(notificationPromises);

//         auctionNamespace.to(itemId).emit('newBid', { userId: socket.userId, amount });

//       } catch (error) {
//         socket.emit('bidError', error.message);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.userId);

//       const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//       const userCount = room ? room.size : 0;
//       auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//     auctionNamespace.to(socket.item._id.toString()).emit('usercount', { userCount });

//     });
//   });
// };

// const checkAuctionEnd = async () => {
//   const items = await Item.find({ endDate: { $lte: new Date() } });
//   for (const item of items) {
//     const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
//     const winnerBid = bids[0];
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     if (winnerBid) {
//       const winnerNotification = new Notification({
//         userId: winnerBid.userId,
//         message: `Congratulations! You have won the auction for item ${item.name} with a bid of ${winnerBid.amount}.`,
//         itemId: item._id,
//       });
//       await winnerNotification.save();

//       auctionNamespace.to(item._id.toString()).emit('auctionEnded', {
//         message: `Auction for item ${item.name} has ended. Winner: ${winnerBid.userId}, Amount: ${winnerBid.amount}`,
//       });
//     }

//     const endNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has ended.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });
//     await Promise.all(endNotifications);
//   }
// };

// setInterval(checkAuctionEnd, 60 * 1000);
// setInterval(notifyItemStart, 60 * 1000);

// module.exports = createAuctionNamespace;


const jwt = require('jsonwebtoken');
const Bid = require('../models/Bid');
const Item = require('../models/item');
const Deposit = require('../models/Deposit');
const Notification = require('../models/notification');
const mongoose = require('mongoose');

let auctionNamespace;

const checkDepositAndItemStatus = async (socket, next) => {
  try {
    const { userId, itemId } = socket.handshake.auth;
    const item = await Item.findById(itemId).populate('subcategoryId');
    if (!item) {
      return next(new Error('Item not found.'));
    }
console.log(item.subcategoryId._id)
    const deposit = await Deposit.findOne({ userId, item: item.subcategoryId._id, status: 'approved' });
    if (!deposit) {
      return next(new Error('User has not paid the deposit for this subcategory.'));
    }
    // const deposit = await Deposit.findOne({ userId, item: itemId, status: 'approved' });
    // if (!deposit) {
    //   return next(new Error('User has not paid the deposit for this item.'));
    // }

    // const item = await Item.findById(itemId);
    const now = new Date();
    if (!item) {
      return next(new Error('Item not found.'));
    }
    if (item.startDate > now) {
      return next(new Error('Auction for this item has not started yet.'));
    }
    if (item.endDate <= now) {
      return next(new Error('Auction for this item has ended.'));
    }
    socket.item = item;
    socket.userId = userId;
    socket.subcategory = item.subcategoryId;
    next();
  } catch (error) {
    next(error);
  }
};

// const notifyItemStart = async () => {
//   const now = new Date();
//   const items = await Item.find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

//   for (const item of items) {
//     const deposits = await Deposit.find({ item: item._id, status: 'approved' });

//     const startNotifications = deposits.map(deposit => {
//       const notification = new Notification({
//         userId: deposit.userId,
//         message: `The auction for item ${item.name} has started.`,
//         itemId: item._id,
//       });
//       return notification.save();
//     });

//     await Promise.all(startNotifications);

//     item.notifiedStart = true;
//     await item.save();

//     auctionNamespace.to(item._id.toString()).emit('itemStarted', {
//       message: `The auction for item ${item.name} has started.`,
//     });
//   }
// };






const notifySubcategoryStart = async () => {
  const now = new Date();
  const subcategories = await mongoose.model('Subcategory').find({ startDate: { $lte: now }, notifiedStart: { $ne: true } });

  for (const subcategory of subcategories) {
    const deposits = await Deposit.find({ subcategory: subcategory._id, status: 'approved' });

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

    subcategory.items.forEach(item => {
      auctionNamespace.to(item._id.toString()).emit('itemStarted', {
        message: `The auction for item ${item.name} in subcategory ${subcategory.name} has started.`,
      });
    });
  }
};

const createAuctionNamespace = (io) => {
  const auctionNamespace = io.of('/auction');
  auctionNamespace.use(checkDepositAndItemStatus);

  auctionNamespace.on('connection', async (socket) => {
    console.log('User connected:', socket.userId);

    socket.join(socket.item._id.toString());

    const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
    const userCount = room ? room.size : 0;
    const bidCount = await Bid.countDocuments({ item: socket.item._id });

    socket.emit('itemDetails', {
      item: socket.item,
      userCount,
      bidCount
    });

    auctionNamespace.to(socket.item._id.toString()).emit('usercount', { userCount });

    socket.on('placeBid', async (bidData) => {
      try {
        const { itemId, amount } = bidData;
        const item = await Item.findById(itemId).populate('subcategoryId');

        const now = new Date();
        if (now > item.subcategoryId.endDate) {
          socket.emit('bidError', 'The auction for this item has ended.');
          return;
        }

        if (amount < item.minBidIncrement) {
          socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${item.minBidIncrement}).`);
          return;
        }

        const bid = new Bid({
          userId: socket.userId,
          item: itemId,
          amount,
          bidTime: now,
        });
        await bid.save();

        item.startPrice += amount;

        const timeRemaining = item.subcategoryId.endDate - now;
        const tenMinutes = 10 * 60 * 1000;
        const twentyMinutes = 5 * 60 * 1000;

        if (timeRemaining <= tenMinutes) {
          item.subcategoryId.endDate = new Date(now.getTime()+ tenMinutes + twentyMinutes);

          if (!socket.firstExtensionDone) {
            socket.firstExtensionDone = true;
          } else {
            item.minBidIncrement *= 2;
          }

          await item.subcategoryId.save();
          await item.save();

          auctionNamespace.to(itemId).emit('auctionExtended', {
            itemId: item._id,
            newEndTime: item.subcategoryId.endDate,
            newMinBidIncrement: item.minBidIncrement
          });
        }

        const bidCount = await Bid.countDocuments({ item: socket.item._id });
        const deposits = await Deposit.find({ subcategory: item.subcategoryId._id, status: 'approved' });
        const notificationPromises = deposits.map(deposit => {
          const notification = new Notification({
            userId: deposit.userId,
            message: `A new bid of ${amount} has been placed on item ${item.name} in subcategory ${item.subcategoryId.name}`,
            itemId,
          });
          return notification.save();
        });

        await Promise.all(notificationPromises);

        auctionNamespace.to(itemId).emit('newBid', {
          userId: socket.userId,
          itemId: item._id,
          item: item,

          amount,
          newprice: item.startPrice,
          bidcount: bidCount
        });

      } catch (error) {
        socket.emit('bidError', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);

      const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
      const userCount = room ? room.size : 0;
      auctionNamespace.to(socket.item._id.toString()).emit('usercount', { userCount });
    });
  });
};

module.exports = createAuctionNamespace;


// const createAuctionNamespace = (io) => {
//   auctionNamespace = io.of('/auction');
//   auctionNamespace.use(checkDepositAndItemStatus);

//   auctionNamespace.on('connection', async (socket) => {
//     console.log('User connected:', socket.userId);

//     socket.join(socket.item._id.toString());

//     const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//     const userCount = room ? room.size : 0;
//     const bidCount = await Bid.countDocuments({ item: socket.item._id });

//     socket.emit('itemDetails', {
//       item: socket.item,
//       userCount,
//       bidCount
//     });

//     auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//     auctionNamespace.to(socket.item._id.toString()).emit('usercount', { userCount });

//     socket.on('placeBid', async (bidData) => {
//       try {
//         const { itemId, amount } = bidData;
//         const item = await Item.findById(itemId);

//         if (amount < item.minBidIncrement) {
//           socket.emit('bidError', `Bid amount must be greater than or equal to the minimum bid amount (${item.minBidIncrement}).`);
//           return;
//         }

//         const bid = new Bid({
//           userId: socket.userId,
//           item: itemId,
//           amount,
//           bidTime: new Date(),
//         });
//         await bid.save();

//         item.startPrice += amount;

//         const now = new Date();
//         const timeRemaining = item.endDate - now;
//         const tenMinutes = 10 * 60 * 1000;
//         const twentyMinutes = 20 * 60 * 1000;

//         if (timeRemaining <= tenMinutes) {
//           item.endDate = new Date(now.getTime() + twentyMinutes);

//           if (!socket.firstExtensionDone) {
//             socket.firstExtensionDone = true;
//           } else {
//             item.minBidIncrement *= 2;
//           }

//           auctionNamespace.to(itemId).emit('auctionExtended', {
//             newEndTime: item.endDate,
//             newMinBidIncrement: item.minBidIncrement
//           });
//         }

//         await item.save();
//         const bidCount = await Bid.countDocuments({ item: socket.item._id });
//         const deposits = await Deposit.find({ item: itemId, status: 'approved' });
//         const notificationPromises = deposits.map(deposit => {
//           const notification = new Notification({
//             userId: deposit.userId,
//             message: `A new bid of ${amount} has been placed on item ${item.name}`,
//             itemId,
//           });
//           return notification.save();
//         });
        
//         await Promise.all(notificationPromises);

//         auctionNamespace.to(itemId).emit('newBid', { userId: socket.userId, itemId:item._id,amount,newprice:item.startPrice,bidcount:bidCount });

//       } catch (error) {
//         socket.emit('bidError', error.message);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.userId);

//       const room = auctionNamespace.adapter.rooms.get(socket.item._id.toString());
//       const userCount = room ? room.size : 0;
//       auctionNamespace.to(socket.item._id.toString()).emit('userCountUpdated', { userCount });
//       auctionNamespace.to(socket.item._id.toString()).emit('usercount', { userCount });
//     });
//   });
// };

const checkAuctionEnd = async () => {
  const items = await Item.find({ endDate: { $lte: new Date() } });
  for (const item of items) {
    const bids = await Bid.find({ item: item._id }).sort({ amount: -1 }).limit(1);
    const winnerBid = bids[0];
    const deposits = await Deposit.find({ item: item._id, status: 'approved' });

    if (winnerBid) {
      const winnerNotification = new Notification({
        userId: winnerBid.userId,
        message: `Congratulations! You have won the auction for item ${item.name} with a bid of ${winnerBid.amount}.`,
        itemId: item._id,
      });
      await winnerNotification.save();

      auctionNamespace.to(item._id.toString()).emit('auctionEnded', {
        message: `Auction for item ${item.name} has ended. Winner: ${winnerBid.userId}, Amount: ${winnerBid.amount}`,
      });
    }

    const endNotifications = deposits.map(deposit => {
      const notification = new Notification({
        userId: deposit.userId,
        message: `The auction for item ${item.name} has ended.`,
        itemId: item._id,
      });
      return notification.save();
    });
    await Promise.all(endNotifications);
  }
};

// setInterval(checkAuctionEnd, 60 * 1000);
// setInterval(notifySubcategoryStart, 60 * 1000);

module.exports = createAuctionNamespace;
