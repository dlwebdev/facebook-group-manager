const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notification model
const notificationSchema = new Schema({
  bill_name: String,
  message: String,
  read: Boolean,
  datedue: Date
});

module.exports = mongoose.model('Notification', notificationSchema);
