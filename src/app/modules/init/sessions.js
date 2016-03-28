'use strict';

var uuid = require('uuid'),
    session = require('express-session'),
    sessionstore = require('sessionstore');

var config = require('config');

module.exports = initSessions;

function initSessions(app) {

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

  return app;

}
