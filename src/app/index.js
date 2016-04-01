'use strict';

var http = require('http');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    flash = require('connect-flash'),
    io = require('socket.io'),
    merge = require('merge'),
    Q = require('q'),
    ReqMapper = require('requirements-mapper');

var config = require('config'),
    auth = require('app/modules/auth'),
    logger = require('app/modules/logger'),
    pug = require('app/modules/pug');

var staticData = new ReqMapper(config.paths.data);

// pipe app through initialization steps
Q(express())

  // setup databases and layouts
  .then(require('app/modules/init/databases'))

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

  // init sessions
  .then(require('app/modules/init/sessions'))

  .then(function(app) {

    // init authentication
    app.use(auth.initialize());
    app.use(auth.session());
    app.use(auth.addUserToLocals());
    logger.log('verbose', 'auth set up');

    // init views
    app.locals = merge({}, app.locals, staticData.map());
    app.engine('pug', pug.renderView);
    app.set('views', config.paths.views);
    app.set('view engine', 'pug');
    logger.log('verbose', 'view engine set up');

    return app;
  })

  // init routes
  .then(require('app/modules/init/routes'))

  // init errorhandling
  .then(require('app/modules/init/errorhandling'))

  .done(function(app) {

    // start listening
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
