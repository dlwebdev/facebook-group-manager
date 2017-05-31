const express = require('express');
const router = express.Router();

const Bill = require('../models/bill');

router.post('/bills/', function(req, res) {
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
router.get('/bills/', function(req, res) {
  const user_id = req.user._id;

  Bill.find({'user_id': user_id}, function (err, bills) {
    if(err) console.log('Err: ', err);
    res.json(bills);
  });
});

// Route for getting Bills from the bills database
router.get('/bills/:id', function(req, res) {
  const id = req.params.id;

  Bill.findOne({'_id':id},function(err, bill) {
    if(err) console.log('Err: ', err);
    return res.json(bill);
  });
});

// Route for updating Bills that are in the bills database
router.put('/bills/:id', function(req, res) {
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
router.delete('/bills/:id', function(req, res) {
  const id = req.params.id;

  console.log("Will remove bill with id of: ", id);

  Bill.remove({'_id': id},function(result) {
    res.json(result);
  });

});

module.exports = router;
