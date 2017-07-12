// load mongoose since we need it to define a model

// User model is a object that tells mongodb how to store user data

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User model
const userSchema = new Schema({
  facebookId: String,
  username: String,
  daysBeforeNotice: Number
});

module.exports = mongoose.model('User', userSchema);
