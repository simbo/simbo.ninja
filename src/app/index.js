'use strict';

var http = require('http');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    flash = require('connect-flash'),
    io = require('socket.io'),
    Q = require('q');

var config = require('config'),
    auth = require('app/modules/auth'),
    logger = require('app/modules/logger');

// pipe app through setup steps
Q(express())

  // setup database layouts
  .then(require('app/modules/init/databases'))

  // setup common
  .then(function(app) {
    app.server = http.Server(app);
    app.io = io(app.server);
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(flash());
    return app;
  })

  // setup sessions
  .then(require('app/modules/init/sessions'))

  // setup authentication
  .then(function(app) {
    app.use(auth.initialize());
    app.use(auth.session());
    app.use(auth.addUserToLocals());
    return app;
  })

  // setup views
  .then(require('app/modules/init/views'))

  // setup routes
  .then(require('app/modules/init/routes'))

  // setup errorhandling
  .then(require('app/modules/init/errorhandling'))

  // start listening
  .then(function(app) {
    app.server.listen(
      config.app.server.port,
      config.app.server.host,
      function() {
        var address = app.server.address();
        logger.log('info', 'server started (listening on %s:%s)', address.address, address.port);
      }
    );
    return app;
  });
