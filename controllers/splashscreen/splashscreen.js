const splash = require('../../models/Splashscreen');


const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
exports.getAllsplash = factory.getAll(splash);
exports.getsplash = factory.getOne(splash);
exports.createsplash = factory.createOne(splash);
exports.updatesplash = factory.updateOne(splash);
exports.splash = factory.deleteOne(splash);