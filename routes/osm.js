var express = require('express');
var router = express.Router();

/* GET OSM listing. */
router.get('/getdata', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
