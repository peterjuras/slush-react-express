'use strict';

import * as express from 'express';
const router = express.Router();

export const appname = '<%= appname %>';

// Return the name of the app when /api gets called
router.get('/', (req, res, next) => {
  res.end(appname);
});

export default router;
