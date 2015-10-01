var express = require('express');
var router = express.Router();

// Return the name of the app when /api gets called
router.get('/', function (req, res, next) {
  res.end('<%= appname %>');
});

module.exports = router;