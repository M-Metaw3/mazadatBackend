const Winner = require('../models/SubcategoryResult');
const AppError = require('../utils/appError');

const ensureWinner = async (req, res, next) => {
    const { userId, itemId, winnerid,subcategory } = req.body;
  console.log(req.body)
    try {
        const winner = await Winner.findOne({ _id: winnerid, userId,subcategory, status: 'winner'});
       

        console.log("winner",winner) // Store winner information for later use
      if (!winner) {
        // return res.status(403).json({ message: 'User is not an approved winner for this item.' });
        return next(new AppError('User is not an approved winner for this item.', 403));
      }
  
      req.winner = winner;
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = ensureWinner;
  