// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const { notifyAuctionEvents } = require('../sockets/notifications');
// const Subcategory = require('../models/subcategory');
// const Item = require('../models/item');
// const Bid = require('../models/Bid');
// const Deposit = require('../models/Deposit');
// const User = require('../models/User');
// const Winner = require('../models/Winner');
// const Notification = require('../models/notification');

// let mongoServer;
// let notificationNamespace = { to: jest.fn().mockReturnValue({ emit: jest.fn() }) };

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// afterEach(async () => {
//   jest.clearAllMocks();
//   await mongoose.connection.db.dropDatabase();
// });

// describe('notifyAuctionEvents', () => {
//   it('should handle auctions correctly and notify users', async () => {
//     const user1 = new User({ _id: new mongoose.Types.ObjectId(), walletBalance: 1000 });
//     const user2 = new User({ _id: new mongoose.Types.ObjectId(), walletBalance: 2000 });
//     await user1.save();
//     await user2.save();

//     const subcategory = new Subcategory({
//       _id: new mongoose.Types.ObjectId(),
//       name: 'Cars',
//       startDate: new Date(Date.now() - 10000),
//       endDate: new Date(Date.now() - 5000),
//     });
//     await subcategory.save();

//     const item1 = new Item({
//       _id: new mongoose.Types.ObjectId(),
//       name: 'BMW',
//       subcategoryId: subcategory._id,
//       startPrice: 500,
//       commission1: 10,
//       commission2: 5,
//       commission3: 3,
//     });
//     const item2 = new Item({
//       _id: new mongoose.Types.ObjectId(),
//       name: 'Mazda',
//       subcategoryId: subcategory._id,
//       startPrice: 300,
//       commission1: 8,
//       commission2: 4,
//       commission3: 2,
//     });
//     await item1.save();
//     await item2.save();

//     const bid1 = new Bid({
//       userId: user1._id,
//       item: item1._id,
//       amount: 700,
//     });
//     const bid2 = new Bid({
//       userId: user2._id,
//       item: item2._id,
//       amount: 400,
//     });
//     await bid1.save();
//     await bid2.save();

//     const deposit1 = new Deposit({
//       userId: user1._id,
//       item: subcategory._id,
//       amount: 500,
//       status: 'approved',
//     });
//     const deposit2 = new Deposit({
//       userId: user2._id,
//       item: subcategory._id,
//       amount: 300,
//       status: 'approved',
//     });
//     await deposit1.save();
//     await deposit2.save();

//     await notifyAuctionEvents(notificationNamespace);

//     const winners = await Winner.find();
//     expect(winners.length).toBe(2);
//     expect(winners.some(winner => winner.userId.equals(user1._id) && winner.status === 'winner')).toBeTruthy();
//     expect(winners.some(winner => winner.userId.equals(user1._id) && winner.status === 'loser')).toBeFalsy();
//     expect(winners.some(winner => winner.userId.equals(user2._id) && winner.status === 'loser')).toBeTruthy();

//     const notifications = await Notification.find();
//     expect(notifications.length).toBeGreaterThan(0);

//     const user1Updated = await User.findById(user1._id);
//     const user2Updated = await User.findById(user2._id);
//     expect(user1Updated.walletBalance).toBe(1000); // No change, because user1 won the item
//     expect(user2Updated.walletBalance).toBeGreaterThan(2000); // Refund applied

//     const subcategoryResults = await SubcategoryResult.find();
//     expect(subcategoryResults.length).toBeGreaterThan(0);
//   });
// });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { notifyAuctionEvents } = require('../sockets/notifications');
const Subcategory = require('../models/subcategory');
const Item = require('../models/item');
const Deposit = require('../models/Deposit');
const Bid = require('../models/Bid');
const Notification = require('../models/notification');
const Winner = require('../models/Winner');
const User = require('../models/User');

jest.mock('../sockets/notifications');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect('mongodb+srv://adalaapp:123456789ma@cluster0.a93vbj1.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
//   await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

describe('notifyAuctionEvents', () => {
  it('should handle auctions correctly and notify users', async () => {
    // Set up dummy data
    const subcategory = await Subcategory.create({ name: 'Test Subcategory', startDate: new Date(), endDate: new Date() });
    const item1 = await Item.create({ name: 'BMW', subcategoryId: subcategory._id, startPrice: 100, commission1: 10, commission2: 5, commission3: 3 });
    const item2 = await Item.create({ name: 'Mazda', subcategoryId: subcategory._id, startPrice: 100, commission1: 10, commission2: 5, commission3: 3 });
    const user1 = await User.create({ name: 'User1', walletBalance: 1000 });
    const user2 = await User.create({ name: 'User2', walletBalance: 1000 });

    await Deposit.create({ userId: user1._id, item: subcategory._id, amount: 50, status: 'approved' });
    await Deposit.create({ userId: user2._id, item: subcategory._id, amount: 50, status: 'approved' });

    await Bid.create({ userId: user1._id, item: item1._id, amount: 150 });
    await Bid.create({ userId: user2._id, item: item2._id, amount: 150 });

    await notifyAuctionEvents();

    const winners = await Winner.find();
    const subcategoryResults = await SubcategoryResult.find();

    expect(winners).toHaveLength(4); // Two winners and two losers
    expect(subcategoryResults).toHaveLength(2); // Two subcategory results, one for each user

    const user1Result = subcategoryResults.find(res => res.userId.equals(user1._id));
    const user2Result = subcategoryResults.find(res => res.userId.equals(user2._id));

    expect(user1Result.totalAmount).toBeGreaterThan(0); // User1 won one item
    expect(user2Result.totalAmount).toBeGreaterThan(0); // User2 won one item
  });
});
