const express = require('express');
const router = express.Router();

const User = require('../models/user')

/* Get all users */
router.get('/', function(req, res) {
  //res.send('will return all users');

  User.find({}, function (err, users) {
    if(err) console.log('Err: ', err);
    res.json(users);
  });

});

module.exports = router;
