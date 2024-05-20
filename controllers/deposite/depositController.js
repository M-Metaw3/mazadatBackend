const jwt = require('jsonwebtoken');
const DepositeSchema = require('../../models/Deposit');


const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
exports.getAllDeposit = factory.getAll(DepositeSchema);
exports.getDeposit = factory.getOne(DepositeSchema);
exports.createDeposit = factory.createOne(DepositeSchema);
exports.updateDeposit = factory.updateOne(DepositeSchema);
exports.deleteDeposit = factory.deleteOne(DepositeSchema);