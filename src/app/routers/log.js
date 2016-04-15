'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('log', {
    title: 'Log'
  });
});

module.exports = router;
