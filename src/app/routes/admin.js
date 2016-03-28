'use strict';

var router = require('express').Router();

var auth = require('app/modules/auth'),
    User = require('app/modules/user');

router.get('/users',
  auth.ensureAuth('admin'),
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
