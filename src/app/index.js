'use strict';

Error.stackTraceLimit = Infinity;

const http = require('http');

const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express = require('express'),
      flash = require('connect-flash'),
      io = require('socket.io'),
      merge = require('merge'),
      q = require('q'),
      ReqMapper = require('requirements-mapper');

const auth = require('app/modules/auth'),
      config = require('config'),
      initRoutes = require('app/modules/init/routes').initRoutes,
      logger = require('app/modules/logger'),
      pug = require('app/modules/pug');

const staticData = new ReqMapper(config.paths.data);

// pipe app through initialization steps
q(express())

  // setup databases and layouts
  .then(require('app/modules/init/databases'))

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

  // init sessions
  .then(require('app/modules/init/sessions'))

  .then((app) => {

    // init authentication
    app.use(auth.passport.initialize());
    app.use(auth.passport.session());
    app.use(auth.addUserToLocals());
    logger.log('verbose', 'set up auth');

    // init views
    app.locals = merge({}, app.locals, staticData.map());
    app.engine('pug', pug.renderView);
    app.set('views', config.paths.views);
    app.set('view engine', 'pug');
    logger.log('verbose', 'set up view engine');

    return app;
  })

  // init routes
  .then(initRoutes)

  // init errorhandling
  .then(require('app/modules/init/errorhandling'))

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
