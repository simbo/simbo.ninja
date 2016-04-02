'use strict';

/**
 * init/sessions
 * =============
 * exports function to setup sessions
 */

var session = require('express-session'),
    sessionstore = require('sessionstore'),
    uuid = require('uuid');

var config = require('config'),
    logger = require('app/modules/logger');

module.exports = initSessions;

/**
 * intialize sessions
 * @param  {Object} app express app
 * @return {Object}     app
 */
function initSessions(app) {

  // create session store
  var store = sessionstore.createSessionStore({
    type: 'couchdb',
    host: 'http://' + config.app.couchdb.host,
    port: config.app.couchdb.port,
    options: {
      auth: {
        username: config.app.couchdb.username,
        password: config.app.couchdb.password
      }
    },
    dbName: 'sessions'
  });

  // init session handling
  app.use(session({
    secret: config.app.sessions.secret,
    genid: function() {
      return uuid.v4();
    },
    name: config.app.sessions.sid,
    cookie: {
      path: config.app.sessions.cookie.path,
      httpOnly: config.app.sessions.cookie.httpOnly,
      secure: config.app.sessions.cookie.secure,
      maxAge: parseInt(config.app.sessions.cookie.maxAge, 10) * 60000
    },
    store: store,
    resave: false,
    saveUninitialized: false
  }));

  // log
  logger.log('verbose', 'set up sessions');

  return app;

}
