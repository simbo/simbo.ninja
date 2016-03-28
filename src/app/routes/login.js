'use strict';

var router = require('express').Router();

var auth = require('app/modules/auth');

var defaultRedirectAfterLogin = '/account';

router.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(defaultRedirectAfterLogin);
  } else {
    res.render('login', {
      title: 'Login',
      errors: req.flash('error')
    });
  }
});

router.post('/login', auth.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
  successReturnToOrRedirect: defaultRedirectAfterLogin
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
