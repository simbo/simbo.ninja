'use strict';

// require core modules
var path = require('path');

// require npm modules
var express = require('express');

// require project modules
var config = require('config'),
    logger = require('app/modules/logger');

// scope vars
var app = express(),
    server;

// apply routes
config.routes.forEach(function(route) {
  app.use(route[0], require('routes/' + route[1]));
});

// setup and listen
server = app.listen(
  config.app.server.port,
  config.app.server.host,
  function() {
    var address = server.address();
    // logger.log('info', 'server started (listening on %s:%s)', address.address, address.port);
  }
);
