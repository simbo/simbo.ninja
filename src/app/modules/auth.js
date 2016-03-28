'use strict';

var Q = require('q'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('app/modules/user');

passport.use(new LocalStrategy(function(username, password, cb) {
  User.verifyUsernamePassword(username, password)
    .then(function(user) {
      cb(null, user);
    }, function(err) {
      cb(null, false, {message: err.message});
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.uuid);
});

passport.deserializeUser(function(id, cb) {
  User.getByUuid(id)
    .then(function(user) {
      cb(null, user);
    }, function(err) {
      cb(err);
    });
});

module.exports = passport;
module.exports.ensureLoggedIn = ensureLoggedIn;
module.exports.ensureUserHasFlag = ensureUserHasFlag;

function ensureLoggedIn(options) {
  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) req.session.returnTo = req.originalUrl || req.url;
      return res.redirect('/login');
    }
    next();
  };
}

function ensureUserHasFlag(flag) {
  return function(req, res, next) {
    Q(req.user)
      .then(User.q.verifyFlag(flag))
      .then(function() {
        next();
      }, function(err) {
        err.status = 401;
        next(err);
      });
  };
}
