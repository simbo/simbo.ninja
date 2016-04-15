'use strict';

const router = require('express').Router();

const passport = require('app/modules/auth').passport;

const defaultRedirectAfterLogin = '/account';

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(defaultRedirectAfterLogin);
  } else {
    res.render('login', {
      title: 'Login',
      errors: req.flash('error')
    });
  }
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
  successReturnToOrRedirect: defaultRedirectAfterLogin
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
