const express = require('express');
const router = express.Router();

var graph = require('fbgraph');

// Route for getting Payments from the payments database
router.get('', function (req, res) {
  //let groups = [];
  //res.json(groups);



  var params = { fields: "picture" };

  graph.get("zuck", params,  function(err, res) {
    console.log(res); // { picture: "http://profile.ak.fbcdn.net/..." }
  });
});

module.exports = router;
