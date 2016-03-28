'use strict';

var router = require('express').Router();

var passport = require('app/modules/passport'),
    User = require('app/modules/user');

router.get('/users',
  passport.ensureLoggedIn(),
  passport.ensureUserHasFlag('admin'),
  function(req, res) {
    User.getAll()
      .then(function(users) {
        res.render('admin/users', {
          users: users
        });
      });
  }
);

module.exports = router;
