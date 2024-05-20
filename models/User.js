const mongoose = require('mongoose');

const  Schema  = mongoose.Schema;

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialist: { type: String },

  birthdate: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  
  profileImage: {    type: {
    name: String,
    path: String,
    pathname: String
  },
  required: [true, 'Please upload an image for the profileImage!'],
  unique: true},  // Path to profile image
  idNumber: { type: String, unique: true },  // ID number
  idImage: {     type: {
    name: String,
    path: String,
    pathname: String
  },
  required: [true, 'Please upload an image for the id image!'],
  unique: true },  // Path to ID image
}, {
  timestamps: true
});

const User = mongoose.model('User', user);
module.exports = User;
