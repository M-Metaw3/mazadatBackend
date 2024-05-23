// const jwt = require('jsonwebtoken');
// const DepositeSchema = require('../../models/Deposit');


// const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
// exports.getDeposit = factory.getOne(DepositeSchema);
// exports.createDeposit = factory.createOne(DepositeSchema);
// exports.deleteDeposit = factory.deleteOne(DepositeSchema);



const Deposit = require('../../models/Deposit');
// const Item = require('../../models/item');
const ItemsSchema = require('../../models/item');
exports.getAllDeposit = factory.getAll(Deposit);
exports.getDeposit = factory.getOne(Deposit);


// Create a new deposit
exports.createDeposit = async (req, res) => {
  try {
    const { userId,  billingmethod, billImage } = req.body;
    const item = req.item;

    const deposit = new Deposit({
      userId,
      item: item,
      amount: item.deposit,
      billImage,
      billingmethod,
    });

    await deposit.save();
    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch notifications for the admin
exports.getAdminNotifications = async (req, res) => {
  try {
    const deposits = await Deposit.find({ seenByadmin: false });
    res.status(200).json(deposits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch deposits and populate item field but only select name and _id
    const deposits = await Deposit.find({ userId, seenByuser: false })
      .populate({ path: 'item', select: 'name _id' })
      .select('status item');

    // Transform the deposits data to remove userId and include only item name
    const transformedDeposits = deposits.map(deposit => ({
      _id: deposit._id,
      _iditem: deposit.item._id,

      item: deposit.item.name,  // Include only the name of the item
      status: deposit.status,
    }));

    // Respond with the transformed data
    res.status(200).json({
      data: {
        message: "تم دفع مبلغ التامين بنجاح و سيتم التحقق من المالية في اقرب وقت ممكن",
        data: {
          notifcatios: transformedDeposits
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Approve a deposit
exports.approveDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await Deposit.findByIdAndUpdate(
      depositId,
      { status: 'approved', seenByadmin: true, seenByuser: false },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found.' });
    }

    res.status(200).json(deposit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject a deposit
exports.rejectDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await Deposit.findByIdAndUpdate(
      depositId,
      { status: 'rejected', seenByadmin: true, seenByuser: false },
      { new: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found.' });
    }

    res.status(200).json(deposit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a deposit
exports.deleteDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await Deposit.findByIdAndDelete(depositId);

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found.' });
    }

    res.status(200).json({ message: 'Deposit deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
