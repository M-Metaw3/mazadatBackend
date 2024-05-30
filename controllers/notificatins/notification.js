
const factory = require('../../utils/apiFactory');
// exports.getDeposit = factory.getOne(DepositeSchema);
// exports.createDeposit = factory.createOne(DepositeSchema);
// exports.deleteDeposit = factory.deleteOne(DepositeSchema);



const Deposit = require('../../models/Deposit');
// const Item = require('../../models/item');
const notification = require('../../models/notification');

const APIFeatures = require('../../utils/apiFeatures');


exports.getusersNotifications = async (req, res) => {
    try {
    const {id}=req.params;
    if(!id){
      return res.status(400).json({error: "You are not authorized to view this content"});
    }
      const features = await new APIFeatures(notification.find({userId: req.params.id}).sort({createdAt: -1}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      
      const notify = await features.query.lean();
 
      res.status(200).json(notify);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.readallnotifications = async (req, res) => {
    try {
    const {id}=req.params;
    if(!id){
      return res.status(400).json({error: "You are not authorized to view this content"});
    }

      const notify = await notification.updateMany({userId: req.params.id},{read: true},null,{multi: true}); 
      if(!notify){
        return res.status(400).json({error: "You are not authorized to view this content"});
      }


      res.status(200).json({meesage: "All notifications are read"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };