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

// pipe app through setup steps
var staticData = new ReqMapper(config.paths.data);

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

    app.locals = merge({}, app.locals, staticData.map());
    app.engine('pug', pug.renderView);
    app.set('views', config.paths.views);
    app.set('view engine', 'pug');

    return app;
  })

  // setup routes
  .then(require('app/modules/init/routes'))

  // setup errorhandling
  .then(require('app/modules/init/errorhandling'))

  // start listening
  .done(function(app) {

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
