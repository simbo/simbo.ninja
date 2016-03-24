'use strict';

var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('log', {
    title: 'Log'
  });
});

module.exports = router;
