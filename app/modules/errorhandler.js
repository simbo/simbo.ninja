'use strict';

var logger = require('./logger');

function logError(err) {
  if (err.status === 404) {
    logger.log('error', '%s %s %s %s', err.message, err.status, err.url);
  } else {
    logger.log('error', err.message, {status: err.status, url: err.url, stack: err.stack});
  }
}

function errorhandler(err, req, res, next) {
  err.status = err.status || 500;
  err.url = req.url;
  logError(err);
  res.status(err.status);
  if (req.accepts('html')) {
    res.render('error', {
      page: {
        title: err.message
      },
      error: err
    });
  } else if (req.accepts('json')) {
    res.send({
      error: err.message
    });
  } else {
    res.type('txt').send('ERROR: ' + err.message);
  }
}

module.exports = errorhandler;
