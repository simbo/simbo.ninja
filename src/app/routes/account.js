'use strict';

var router = require('express').Router();

var auth = require('app/modules/auth');

router.get('/',
  auth.ensureLoggedIn(),
  function(req, res) {
    res.render('account/home');
  }
);

router.get('/profile',
  auth.ensureLoggedIn(),
  function(req, res) {
    res.render('account/profile');
  }
);

module.exports = router;
