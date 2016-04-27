'use strict';

const router = require('express').Router();

const ensureAuth = require('app/modules/auth').ensureAuth,
      userFactory = require('app/factories/user'),
      userRepo = require('app/repositories/user');

router.get('/users', ensureAuth('admin'), (req, res) => {
  userRepo.view('byId')
    .then((obj) => userFactory(obj))
    .then((users) => {
      res.render('admin/users', {users});
    });
});

module.exports = router;
