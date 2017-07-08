const express = require('express');
const router = express.Router();

// Route for getting Payments from the payments database
router.get('', function (req, res) {
  let groups = [];
  res.json(groups);
});

module.exports = router;
