const express = require('express');
const moment = require('moment');

const router = express.Router();
const Payment = require('../models/payment');

// Route for getting Payments from the payments database
router.get('', function (req, res) {
  Payment.find({user_id: req.user._id}, function (err, payments) {
    if (err) console.log('Err: ', err);
    res.json(payments);
  });
});

// Returns all payments for the current month
router.get('/current-month', function (req, res) {
  // use moment to get the month of the current date
  let month = moment().month();
  let year = moment().year();

  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  let startOfMonth = moment([year, month]).add(0, "month");

  // Clone the value before .endOf()
  let endOfMonth = moment(startOfMonth).endOf('month');

  Payment.find({payment_date: {$gte: startOfMonth, $lt: endOfMonth}}, function (err, payments) {
    // Find all payments where payment_date is in the current month and year
    if (err) console.log('Err: ', err);
    res.json(payments);
  });
});

module.exports = router;
