'use strict';

/**
 * init/databases
 * ==============
 * - exports couchdb connection
 * - exports function to setup/update databases and database layouts
 */

const async = require('async'),
      cradle = require('cradle'),
      q = require('q');

const config = require('config'),
      logger = require('app/modules/logger');


const couch = new cradle.Connection(config.app.couchdb.host, config.app.couchdb.port, {
  auth: {
    username: config.app.couchdb.username,
    password: config.app.couchdb.password
  }
});


module.exports = {
  couch,
  init: initDatabases
};

/**
 * asynchronously setup configured databases
 * @param  {Object} app express app
 * @return {Object}     app
 */
function initDatabases(app) {
  return q.Promise((resolve, reject) => {
    async.forEachOf(config.app.databases, setupDatabase, (err) => {
      if (err) reject(err);
      else resolve(app);
    });
  });
}

/**
 * create a database and if it does not exist
 * @param  {Object}   design database design object
 * @param  {String}   name   database name
 * @param  {Function} cb     callback
 */
function setupDatabase(design, name, cb) {
  const db = couch.database(name);
  db.exists((err, exists) => {
    if (err) cb(err);
    else if (exists) applyDesign(db, design, cb);
    else {
      db.create((error) => {
        if (err) cb(error);
        else {
          logger.log('verbose', `created database ${name}`);
          applyDesign(db, design, cb);
        }
      });
    }
  });
}

/**
 * apply design object to a database
 * @param  {Object}   db     cradle database object
 * @param  {Object}   design database design object
 * @param  {Function} cb     callback
 */
function applyDesign(db, design, cb) {
  db.save(`_design/${db.name}`, design, (err) => {
    if (err) cb(err);
    else {
      logger.log('verbose', `applied database layout for ${db.name}`);
      cb();
    }
  });
}
