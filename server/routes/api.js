const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/authenticated', function(req, res, next) {
  let authed = false;

  if (req.isAuthenticated()) {
    authed = true;
  }
  res.json({'authenticated': authed});
});


// Logout Route

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

const users = require('./users');
const bills = require('./bills');
const payments = require('./payments');
const notifications = require('./notifications');

router.use('/user', users);
router.use('/bills', bills);
router.use('/payments', payments);
router.use('/notifications', notifications);

module.exports = router;
