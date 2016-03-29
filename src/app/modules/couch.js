'use strict';

var cradle = require('cradle');

var config = require('config');

// create couchdb connection using cradle
var couch = new cradle.Connection(config.app.couchdb.host, config.app.couchdb.port, {
  auth: {
    username: config.app.couchdb.username,
    password: config.app.couchdb.password
  }
});

module.exports = couch;
