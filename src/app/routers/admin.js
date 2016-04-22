'use strict';

const router = require('express').Router();

const ensureAuth = require('app/modules/auth').ensureAuth,
      User = require('app/modules/user');

router.get('/users', ensureAuth('admin'), (req, res) => {
  User.getAll()
    .then((users) => {
      res.render('admin/users', {users});
    });
});

module.exports = router;
