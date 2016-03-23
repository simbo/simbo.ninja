'use strict';

var async = require('async'),
    Q = require('q');

var config = require('config'),
    couch = require('app/modules/couch');

module.exports = setupDatabases;

function setupDatabases(app) {
  return Q.Promise(function(resolve, reject) {
    async.forEachOf(config.app.databases, setupDatabase, function(err) {
      if (err) reject(err);
      else resolve(app);
    });
  });
}

function setupDatabase(design, name, cb) {
  var db = couch.database(name);
  db.exists(function(err, exists) {
    if (err) cb(err);
    else if (exists) applyDesign(db, design, cb);
    else db.create(function(err) {
      if (err) cb(err);
      else applyDesign(db, design, cb);
    })
  });
}

function applyDesign(db, design, cb) {
  db.save('_design/' + db.name, design, function(err) {
    if (err) cb(err);
    else cb();
  })
}
