const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], required: true },
  endpoint: { type: String, required: true }
}, {
  timestamps: true
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
