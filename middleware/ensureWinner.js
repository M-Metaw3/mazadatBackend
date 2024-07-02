const Winner = require('../models/SubcategoryResult');
const Item = require('../models/item');

const AppError = require('../utils/appError');

const ensureWinner = async (req, res, next) => {
  const { userId, itemId, winnerid, subcategory } = req.body;

  try {
    const winner = await Winner.findOne({ _id: winnerid, userId, subcategory, status: 'winner' }).populate('results');
// console.log(winner)
    if (!winner) {
      return next(new AppError('User is not an approved winner for this item.', 403));
    }
    const hasPendingAdminApproval = winner.results.some(result => result.adminApproval == false);
    console.log(hasPendingAdminApproval)

    if (hasPendingAdminApproval) {
      return next(new AppError('This winner has results pending admin approval.', 403));
    }
    const item = await Item.findById(itemId);
    if (!item) {
      return next(new AppError('Item not found', 404));
    }

    req.item = item;
    req.winner = winner;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = ensureWinner;
