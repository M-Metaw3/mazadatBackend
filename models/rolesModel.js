const mongoose = require('mongoose');
const { Schema } = mongoose;
const Permission = require('./permissions');
const roleSchema = new Schema({
  name: {
    type: String,
    default: 'user',
    unique: true
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission'
  }]
});
roleSchema.pre(/^find/, function(next) {
    this.populate('permissions');
    next();
  });
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
