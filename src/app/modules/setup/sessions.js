'use strict';

var uuid = require('uuid'),
    session = require('express-session'),
    sessionstore = require('sessionstore');

var config = require('config');

module.exports = setupSessions;

function setupSessions(app) {

  var store = sessionstore.createSessionStore({
    type: 'couchdb',
    host: 'http://' + config.app.couchdb.host,
    port: config.app.couchdb.port,
    options: config.app.couchdb.connectionOptions,
    dbName: 'sessions',
    collectionName: 'sessions',
    timeout: 10000
  });

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
      maxAge: parseInt(config.app.sessions.cookie.maxAge, 2) * 60000
    },
    store: store,
    resave: false,
    saveUninitialized: false
  }));

  return app;

}
