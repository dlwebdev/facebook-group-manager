// load mongoose since we need it to define a model

// Bill model is a object that tells mongodb how to store bill data

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bill model
const billSchema = new Schema({
  user_id: String,
  name: String,
  image: String,
  datedue: Number,
  amount: Number,
  datepaid: Date,
  status: String
});

module.exports = mongoose.model('Bill', billSchema);
