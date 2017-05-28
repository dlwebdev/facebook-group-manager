const express = require('express');
const router = express.Router();

/* Get all users */
router.get('/', function(req, res) {
  res.send('will return all bills');
  /*
  Bill.find({}, function (err, users) {
    if(err) console.log('Err: ', err);
    res.json(users);
  });
  */
});

module.exports = router;
