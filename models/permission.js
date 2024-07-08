const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], required: true },
  endpoint: { type: String, required: true }
}, {
  timestamps: true
});
permissionSchema.index({ method: 1, endpoint: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
