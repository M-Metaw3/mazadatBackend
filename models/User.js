const mongoose = require('mongoose');

const  Schema  = mongoose.Schema;

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialist: { type: String },
  companyname: { type: String },
  address: { type: String },



  birthdate: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },

  

  profileImage: {    type: {
    name: String,
    path: String,
    pathname: String
  },default: {
    name: 'default.png',
    path: 'default.png',
    pathname: 'default.png'
  },
select:false
  }, 
  
  // Path to profile image
  idNumber: { type: String, unique: true },  // ID number
  idImage: {     type: {
    name: String,
    path: String,
    pathname: String
  },
  required: [true, 'Please upload an image for the id image!'],
  unique: true },  // Path to ID image
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});


user.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

const User = mongoose.model('User', user);
module.exports = User;
