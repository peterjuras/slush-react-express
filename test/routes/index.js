var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('azure-express-generator');
});

module.exports = router;