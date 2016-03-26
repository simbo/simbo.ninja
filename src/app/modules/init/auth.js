'use strict';

var passport = require('app/modules/passport');

module.exports = initAuth;

function initAuth(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  return app;

}
