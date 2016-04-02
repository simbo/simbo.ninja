'use strict';

var router = require('express').Router();

router.get('/', function(req, res) {
  if (!req.session.date) req.session.date = new Date();
  res.send({
    status: 'OK',
    session: req.session
  });
});

module.exports = router;
