'use strict';

var logger = require('app/modules/logger');

module.exports = setupErrorhandling;

function setupErrorhandling(app) {
  app.use(error404);
  app.use(errorhandler);
  return app;
}

function error404(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}

function errorhandler(err, req, res, next) {

  err.status = err.status || 500;
  err.url = req.url;

  logger.log('error', '%s %s %s', err.status, err.message, err.url, err);

  res.status(err.status);

  if (req.accepts('html')) res.render('error', {error: err});
  else if (req.accepts('json')) res.send({error: err});
  else res.type('txt').send('ERROR: ' + err.message);

}
