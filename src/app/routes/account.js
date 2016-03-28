'use strict';

var router = require('express').Router();

var auth = require('app/modules/auth');

router.get('/',
  auth.ensureAuth(),
  function(req, res) {
    res.render('account/home');
  }
);

router.get('/profile',
  auth.ensureAuth(),
  function(req, res) {
    res.render('account/profile');
  }
);

module.exports = router;
