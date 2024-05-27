// const jwt = require('jsonwebtoken');
// const DepositeSchema = require('../../models/Deposit');


// const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
// exports.getDeposit = factory.getOne(DepositeSchema);
// exports.createDeposit = factory.createOne(DepositeSchema);
// exports.deleteDeposit = factory.deleteOne(DepositeSchema);



const Deposit = require('../../models/Bid');
// const Item = require('../../models/item');
const ItemsSchema = require('../../models/item');
exports.getAllDeposit = factory.getAll(Deposit);
exports.getDeposit = factory.getOne(Deposit);
