const express = require('express');
const router = express.Router();

const User = require('../models/user');
const NotificationChecker = require('../notificationChecker');

/* Get all users */
router.get('/', function(req, res) {
  //res.send('will return all users');

  User.find({}, function (err, users) {
    if(err) console.log('Err: ', err);
    res.json(users);
  });

});

// get users settings
router.get('/settings', function(req, res) {
  const user_id = req.user._id;

  User.findOne({'_id':user_id},function(err, user) {
    if(err) console.log('Err: ', err);
    return res.json(user.daysBeforeNotice);
  });
});

router.put('/settings', function(req, res) {
  const user_id = req.user._id;
  const setting = req.body.setting;

  if (setting) {
    User.update({_id: user_id}, {daysBeforeNotice: setting}, {upsert: true}, function (err, resp) {
      if(err) console.log('Err: ', err);

      // Do notification check
      NotificationChecker.checkForNotifications(req);

      return res.json(resp);
    });
  }

});

module.exports = router;
