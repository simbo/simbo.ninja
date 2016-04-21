'use strict';

/**
 * auth
 * ====
 * - exports passport with auth strategies and session handlers
 * - exports middleware for ensuring authentication
 * - exports middleware for adding current user to locals
 */

const LocalStrategy = require('passport-local').Strategy,
      q = require('q'),
      passport = require('passport');

const User = require('app/modules/user');

// create local authentication strategy
passport.use(new LocalStrategy((username, password, cb) => {
  User.verifyUsernamePassword(username, password)
    .then((user) => {
      cb(null, user);
    }, (err) => {
      cb(null, false, {message: err.message});
    });
}));

// set handler to serialize user object for saving into session
passport.serializeUser((user, cb) => {
  cb(null, user.uuid);
});

// set handler to deserialize user object when restoring from session
passport.deserializeUser((id, cb) => {
  User.getByUuid(id)
    .then((user) => {
      cb(null, user);
    }, (err) => {
      cb(err);
    });
});

module.exports = {
  passport,
  ensureAuth,
  addUserToLocals
};

/**
 * middleware to ensure authenticated access, optionally requiring one or more user flags
 * @param  {mixed}    flags single flag string or array of flags
 * @return {Function}       request handler
 */
function ensureAuth(flags) {
  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) req.session.returnTo = req.originalUrl || req.url;
      return res.redirect('/login');
    } else if (flags) {
      (Array.isArray(flags) ? flags : [flags])
        .reduce((queue, flag) => queue.then(User.q.verifyFlag(flag)), q(req.user))
        .then(() => {
          next();
        }, (err) => {
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
  return (req, res, next) => {
    res.locals.user = req.isAuthenticated() ? req.user : null;
    next();
  };
}
