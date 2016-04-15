'use strict';

/**
 * couch
 * =====
 * exports cradle couchdb connection
 */

const cradle = require('cradle');

const config = require('config');

// create couchdb connection using cradle
const couch = new cradle.Connection(config.app.couchdb.host, config.app.couchdb.port, {
  auth: {
    username: config.app.couchdb.username,
    password: config.app.couchdb.password
  }
});

/**
 * export couch
 * @type {Object}
 */
module.exports = couch;
