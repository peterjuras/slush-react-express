import express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.end('<%= appname %>');
});

export = router;