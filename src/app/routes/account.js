'use strict';

var router = require('express').Router();

var passport = require('app/modules/passport');

router.get('/profile', passport.ensureLoggedIn(), function(req, res) {
  res.render('account/profile', {
    user: req.user
  });
});

module.exports = router;
