'use strict';

// require core modules
var path = require('path');

// require npm modules
var express = require('express');

// require project modules
var config = require('../config'),
    errorhandler = require('./modules/errorhandler'),
    logger = require('./modules/logger');

// scope vars
var app = express(),
    server;

// apply routes
config.routes.forEach(function(route) {
  app.use(route[0], require('routes/' + route[1]));
});

// catch 404 and forward to error handler
app.use(function error404(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler);

// setup and listen
server = app.listen(
  config.app.server.port,
  config.app.server.host,
  function() {
    var address = server.address();
    logger.log('info', 'server started (listening on %s:%s)', address.address, address.port);
  }
);
