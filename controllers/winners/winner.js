const jwt = require('jsonwebtoken');
const winnerschemaSchema = require('../../models/Winner');


const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
const { options } = require('joi');
exports.getallwinners = factory.getAll(winnerschemaSchema);
exports.getwinners = async (req, res) => {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;
    try {

  
      if (id) {
        winner = await winnerschemaSchema.find({ userId:id }).populate({path:'itemId',
          populate: {
            path: 'subcategoryId',
            select: 'name -categoryId -items',
            options: { virtuals: false }
              // Only select the name field
        }}).setOptions({ noPopulate: true }).lean()
        .exec();
      }
  
      if (!winner) {
        return res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID'
        });
      }
  
      // return res.status(200).json({
      //   depositStatus: deposit ? deposit.status : 'false',
      //   subcategory: deposit ? deposit.item : subcategory
      // });
  
      return    res.status(200).json({
        status: 'success',
        data: {
           mybid: winner
        }
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'An error occurred' });
    }
  };

exports.deleteitems = factory.deleteOne(winnerschemaSchema);