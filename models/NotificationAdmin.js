// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification must have a title'],
  },
  message: {
    type: String,
    required: [true, 'Notification must have a message'],
  },
  sendAt: {
    type: Date,
    required: [true, 'Notification must have a sendAt date'],
  },
  type: {
    type: String,
    enum: ['immediate', 'scheduled'],
    required: [true, 'Notification must have a type'],
  },
  sent: {
    type: Boolean,
    default: false,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    // required: true,
  },
}, {
  timestamps: true,
});

const NotificationAdmin = mongoose.model('NotificationAdmin', notificationSchema);
module.exports = NotificationAdmin;
