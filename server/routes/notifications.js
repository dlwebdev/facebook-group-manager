const express = require('express');
const router = express.Router();

const moment = require('moment');

const Notification = require('../models/notification');

const NotificationChecker = require('../notificationChecker');

// /api/notifications routes

router.get('/', function(req, res) {
  Notification.find({}, function (err, notifications) {
    if(err) console.log('Err: ', err);
    res.json(notifications);
  });
});

router.get('/unread', function(req, res) {
  // find notifications where read = false

  Notification.find({ "read": "false" }, function (err, notifications) {
    if(err) console.log('Err: ', err);
    res.json(notifications);
  });
});


router.put('/:id', function(req, res) {
  const id = req.params.id;

  console.log("Setting read to true for notification with id of: ", id);

  Notification.findOne({'_id':id},function(err, notice) {
    if(err) console.log('Err: ', err);

    notice.read = true;

    delete notice._id;

    Notification.update({ _id: id }, notice, { upsert: true }, function (err, notification) {
      if(err) console.log('Err: ', err);
      return res.status(201).json(notification);
    });
  });

});

module.exports = router;
