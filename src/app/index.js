'use strict';

Error.stackTraceLimit = Infinity;

const http = require('http');

const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express = require('express'),
      flash = require('connect-flash'),
      io = require('socket.io'),
      q = require('q');

const config = require('config'),
      logger = require('app/modules/logger');

// pipe app through initialization steps
q(express())

  .then(require('app/modules/database').init)

  .then((app) => {

    // add references to server and sockets
    app.server = http.Server(app);
    app.io = io(app.server);

    // add parsers
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    // add flash messages support
    app.use(flash());

    return app;

  })

  .then(require('app/modules/sessions').init)
  .then(require('app/modules/auth').init)
  .then(require('app/modules/renderer').init)
  .then(require('app/routers').init)
  .then(require('app/modules/errorhandling').init)

  .done((app) => {

    // start listening
    app.server.listen(
      config.app.server.port,
      config.app.server.host,
      () => {
        const address = app.server.address();
        logger.log('info', 'server started (listening on %s:%s)', address.address, address.port);
      }
    );

    return app;
  },

  // catch errors
  (err) => {
    logger.log('error', err);
  });
