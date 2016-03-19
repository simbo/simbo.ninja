'use strict';

var errorhandler = require('../../functions/errorhandler');

module.exports = setupErrorhandler;

function setupErrorhandler(app) {

  app.use(function error404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(errorhandler);

  return app;

}
