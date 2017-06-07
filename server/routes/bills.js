const express = require('express');
const router = express.Router();

const moment = require('moment');

const Bill = require('../models/bill');
const Payment = require('../models/payment');
const Notification = require('../models/notification');

// /api/bills routes

router.post('/', function(req, res) {
  // Create a new bill
  let bill = new Bill({
    user_id: req.user._id,
    name: req.body.name,
    datedue: req.body.datedue,
    amount: req.body.amount
  });

  // Route for saving Bills to the bills database
  bill.save(function (err, bill) {
    if (err) console.log('error saving bill: ', err);
    res.status(201).json(bill);
  });
});

// Route for deleting Bills from the bills database
router.get('/', function(req, res) {
  Bill.find({'user_id': req.user._id}, function (err, bills) {
    if(err) console.log('Err: ', err);
    res.json(bills);
  });
});

// Route for getting Bills from the bills database
router.get('/:id', function(req, res) {
  Bill.findOne({'_id': req.params.id},function(err, bill) {
    if(err) console.log('Err: ', err);
    return res.json(bill);
  });
});

// Route for updating Bills that are in the bills database
router.put('/:id', function(req, res) {
  let bill = req.body;
  const id = bill._id;

  delete bill._id;

  if (id) {
    Bill.update({_id: id}, bill, {upsert: true}, function (err, bill) {
      if(err) console.log('Err: ', err);
      return res.json(bill);
    });
  }
});

// Route for deleting Bills from the bills database
router.delete('/:id', function(req, res) {
  Bill.remove({'_id': req.params.id},function(result) {
    res.json(result);
  });
});


router.post('/payment', function(req, res) {
  // Create a new payment
  let currentDate = moment().format('YYYY-MM-DD');

  // Tells api what is required for a new Payment
  let payment = new Payment({
    user_id: req.user._id,
    bill_id: req.body.bill_id,
    bill_name: req.body.bill_name,
    datepaid: currentDate,
    payment_date: moment().format('MM-DD-YYYY')
  });

  // Route for saving Payments to the payments database
  payment.save(function (err, payment) {
    if (err) console.log('error saving payment: ', err);

    // Remove notifications for this bill id
    Notification.remove({'bill_name': req.body.bill_name},function(result) {
      // Removed notification
    });

    res.status(201).json(payment);
  });

});

module.exports = router;
