const jwt = require('jsonwebtoken');
const ItemsSchema = require('../../models/item');


const catchAsync = require('../../utils/catchAsync');
const factory = require('../../utils/apiFactory');
exports.getAllitems = factory.getAll(ItemsSchema);
exports.getitems = factory.getOne(ItemsSchema,{ path: 'subcategoryId' });
exports.createitems = factory.createOne(ItemsSchema);
exports.updateitems = factory.updateOne(ItemsSchema);
exports.deleteitems = factory.deleteOne(ItemsSchema);










// const Item = require('../models/item');
// const { deleteImage } = require('../utils/imageUtils');

// const getItems = async (req, res) => {
//   try {
//     const items = await Item.find({ subcategoryId: req.params.subcategoryId }).lean();
//     res.status(200).json(items);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const getItemById = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id).lean();
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }
//     res.status(200).json(item);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const createItem = async (req, res) => {
//   try {
//     const { name, description, subcategoryId, startPrice, minBidIncrement, startDate, endDate } = req.body;
//     const image = req.file.path;

//     const item = new Item({ name, description, subcategoryId, startPrice, minBidIncrement, startDate, endDate, image });
//     await item.save();

//     res.status(201).json(item);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const updateItem = async (req, res) => {
//   try {
//     const { name, description, subcategoryId, startPrice, minBidIncrement, startDate, endDate } = req.body;
//     const image = req.file ? req.file.path : null;

//     const item = await Item.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     item.name = name;
//     item.description = description;
//     item.subcategoryId = subcategoryId;
//     item.startPrice = startPrice;
//     item.minBidIncrement = minBidIncrement;
//     item.startDate = startDate;
//     item.endDate = endDate;
//     if (image) {
//       deleteImage(item.image);
//       item.image = image;
//     }
//     await item.save();

//     res.status(200).json(item);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// const deleteItem = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     await item.remove();
//     res.status(200).json({ message: 'Item deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   getItems,
//   getItemById,
//   createItem,
//   updateItem,
//   deleteItem
// };
