const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
 name: {
        type: String,
        required: true,
        unique: true
      },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    required: true
  },
  endpoint: {
    type: String,
    required: true,


  }
});
permissionSchema.index({ method: 1, endpoint: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;


//i will search for the permissions by discription and method 
//if found i will return the permission
//and compare the permission with the permission in the request