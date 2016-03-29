'use strict';

/**
 * auth module
 * - exports passport with auth strategies and session handlers
 * - exports middleware for ensuring authentication
 * - exports middleware for adding current user to locals
 */

var Q = require('q'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('app/modules/user');

// create local authentication strategy
passport.use(new LocalStrategy(function(username, password, cb) {
  User.verifyUsernamePassword(username, password)
    .then(function(user) {
      cb(null, user);
    }, function(err) {
      cb(null, false, {message: err.message});
    });
}));

// serialize user object for saving into session
passport.serializeUser(function(user, cb) {
  cb(null, user.uuid);
});

// deserialize user object when restoring from session
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

/**
 * middleware to ensure authenticated access, optionally requiring one or more user flags
 * @param  {mixed}    flags single flag string or array of flags
 * @return {Function}       request handler
 */
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

/**
 * middleware to add current user object to template locals (or null if not authenticated)
 * @return {Function} request handler
 */
function addUserToLocals() {
  return function(req, res, next) {
    res.locals.user = req.isAuthenticated() ? req.user : null;
    next();
  };
}
