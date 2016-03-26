'use strict';

var router = require('express').Router();

var passport = require('app/modules/passport');

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/'
}), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
