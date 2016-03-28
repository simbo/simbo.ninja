'use strict';

var auth = require('app/modules/auth');

module.exports = initAuth;

function initAuth(app) {

  app.use(auth.initialize());
  app.use(auth.session());
  app.use(auth.addUserToLocals());

  return app;

}
