'use strict';

var cradle = require('cradle');

var config = require('config/app/couchdb');

var couch = new cradle.Connection(
  config.host,
  config.port,
  config.connectionOptions
);

module.exports = couch;
