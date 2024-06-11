const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]  // Reference to Permission schema
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
