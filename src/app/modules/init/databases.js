'use strict';

/**
 * init/databases
 * ==============
 * exports function to setup/update databases and database layouts
 */

var async = require('async'),
    Q = require('q');

var config = require('config'),
    couch = require('app/modules/couch'),
    logger = require('app/modules/logger');

module.exports = initDatabases;

/**
 * asynchronously setup configured databases
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
function initDatabases(app) {
  return Q.Promise(function(resolve, reject) {
    async.forEachOf(config.app.databases, setupDatabase, function(err) {
      if (err) reject(err);
      else resolve(app);
    });
  });
}

/**
 * [setupDatabase description]
 * @param  {[type]}   design [description]
 * @param  {[type]}   name   [description]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
function setupDatabase(design, name, cb) {
  var db = couch.database(name);
  db.exists(function(err, exists) {
    if (err) cb(err);
    else if (exists) applyDesign(db, design, cb);
    else {
      db.create(function(err) {
        if (err) cb(err);
        else {
          logger.log('verbose', 'created database ' + name);
          applyDesign(db, design, cb);
        }
      });
    }
  });
}

function applyDesign(db, design, cb) {
  db.save('_design/' + db.name, design, function(err) {
    if (err) cb(err);
    else {
      logger.log('verbose', 'applied database layout for ' + db.name);
      cb();
    }
  });
}
