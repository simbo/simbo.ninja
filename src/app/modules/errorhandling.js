'use strict';

/**
 * init/errorhandling
 * ==================
 * exports function to setup errorhandling
 */

const logger = require('app/modules/logger');

module.exports = {
  init: initErrorhandling
};

/**
 * initialize errorhandling
 * @param  {Object}  app express app
 * @return {Object}  app
 */
function initErrorhandling(app) {
  app.use(error404);
  app.use(errorhandler);
  logger.log('verbose', 'set up errorhandling');
  return app;
}

/**
 * request handler if no route handler found
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next callback
 */
function error404(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}

/**
 * request error handler
 * @param  {Object}   err  error
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Object}   next callback
 */
function errorhandler(err, req, res, next) {

  // populate error object
  err.status = err.status || 500;
  err.url = req.url;

  // log error
  if (err.status === 404) logger.log('error', String(err.status), err.message, err.url);
  else logger.log('error', String(err.status), err.message, err.url, err);

  // output error
  res.status(err.status);
  if (req.accepts('html')) res.render('error', {error: err});
  else if (req.accepts('json')) res.send({error: err});
  else res.type('txt').send(`ERROR: ${err.message}`);

}
