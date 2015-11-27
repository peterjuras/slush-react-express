'use strict';

const express = require('express');
const router = express.Router();

const appname = '<%= appname %>';

// Return the name of the app when /api gets called
router.get('/', (req, res, next) => {
  res.end(appname);
});

module.exports = {
  appname: appname,
  router: router
};
