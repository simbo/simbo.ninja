'use strict';

var passport = require('passport'),
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

function ensureLoggedIn(options) {
  var url, setReturnTo;
  if (typeof options == 'string') options = {redirectTo: options};
  options = options || {};
  url = options.redirectTo || '/login';
  setReturnTo = options.setReturnTo === undefined ? true : options.setReturnTo;
  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) req.session.returnTo = req.originalUrl || req.url;
      return res.redirect(url);
    }
    next();
  };
}
