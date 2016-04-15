'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.date) req.session.date = new Date();
  res.send({
    status: 'OK',
    session: req.session
  });
});

module.exports = router;
