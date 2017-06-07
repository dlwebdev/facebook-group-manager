const express = require('express');
const router = express.Router();

const moment = require('moment');

const Bill = require('../models/bill');
const Payment = require('../models/payment');

const Notification = require('../models/notification');

const NotificationChecker = require('../notificationChecker');

// /api/bills routes

router.post('/', function(req, res) {
  // Create a new bill

  // Tells api what is required for a new Bill
  let bill = new Bill({
    user_id: req.user._id,
    name: req.body.name,
    datedue: req.body.datedue,
    amount: req.body.amount
  });

  // Route for saving Bills to the bills database
  bill.save(function (err, bill) {
    if (err) {
      console.log('error saving bill: ', err);
    }
    res.status(201).json(bill);
  });

});

// Route for deleting Bills from the bills database
router.get('/', function(req, res) {
  const user_id = req.user._id;

  Bill.find({'user_id': user_id}, function (err, bills) {
    if(err) console.log('Err: ', err);
    res.json(bills);
  });
});

// Route for getting Bills from the bills database
router.get('/:id', function(req, res) {
  const id = req.params.id;

  Bill.findOne({'_id':id},function(err, bill) {
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
  const id = req.params.id;

  console.log("Will remove bill with id of: ", id);

  Bill.remove({'_id': id},function(result) {
    res.json(result);
  });

});


router.post('/payment', function(req, res) {
  // Create a new payment
  // Tells api what is required for a new Payment
  let payment = new Payment({
    user_id: req.user._id,
    bill_id: req.body.bill_id,
    bill_name: req.body.bill_name,
    payment_date: moment().format('MM-DD-YYYY')
  });

  // Route for saving Payments to the payments database
  payment.save(function (err, payment) {
    if (err) {
      console.log('error saving payment: ', err);
    }

    // REmove notifications for this bill id

    Notification.remove({'bill_name': req.body.bill_name},function(result) {
      // Removed notification
    });


    res.status(201).json(payment);
  });

});

module.exports = router;
