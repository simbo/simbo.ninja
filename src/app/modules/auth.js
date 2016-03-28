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
module.exports.ensureAuth = ensureAuth;
module.exports.addUserToLocals = addUserToLocals;

function ensureAuth(flags) {
  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) req.session.returnTo = req.originalUrl || req.url;
      return res.redirect('/login');
    } else if (flags) {
      (Array.isArray(flags) ? flags : [flags]).reduce(function(queue, flag) {
        return queue.then(User.q.verifyFlag(flag));
      }, Q(req.user)).then(function() {
        next();
      }, function(err) {
        err.status = 401;
        next(err);
      });
    } else next();
  };
}

function addUserToLocals() {
  return function(req, res, next) {
    res.locals.user = req.isAuthenticated() ? req.user : null;
    next();
  };
}
