// load mongoose since we need it to define a model

// Payment model is a object that tells mongodb how to store payment data

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Payment model
const paymentSchema = new Schema({
  user_id: String,
  bill_id: String,
  bill_name: String,
  payment_date: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
