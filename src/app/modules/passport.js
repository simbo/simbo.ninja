'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var couch = require('app/modules/couch');

var db = couch.database('users');

passport.use(new LocalStrategy(function(username, password, cb) {
  var user = {id: 1, username: 'simbo', password: '12345'};
  return cb(null, user);
}));

passport.serializeUser(function(user, cb) {
  cb(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, cb) {
  cb(null, JSON.parse(user));
});

module.exports = passport;
module.exports.ensureLoggedIn = ensureLoggedIn;

function ensureLoggedIn(options) {
  var url,
      setReturnTo;
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
