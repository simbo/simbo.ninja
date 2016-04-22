'use strict';

const router = require('express').Router();

const ensureAuth = require('app/modules/auth').ensureAuth;

router.get('/', ensureAuth(), (req, res) => {
  res.render('account/home');
});

router.get('/profile', ensureAuth(), (req, res) => {
  res.render('account/profile');
});

module.exports = router;
