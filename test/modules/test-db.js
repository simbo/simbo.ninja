'use strict';

const cradle = require('cradle');

const config = require('config');

const couch = new cradle.Connection(config.app.couchdb.host, config.app.couchdb.port, {
  auth: {
    username: config.app.couchdb.username,
    password: config.app.couchdb.password
  }
});

const db = couch.database('test');

const testDesign = {
  views: {
    byId: {
      map: function(doc) {
        if (doc._id) emit(doc._id, doc);
      }
    }
  }
};

module.exports = {
  db,
  setup: (cb) => { setupDatabase(testDesign, 'test', cb); },
  destroy: (cb) => { db.destroy(cb); }
};

function setupDatabase(design, name, cb) {
  const designPath = `_design/${db.name}`;
  db.exists((err, exists) => {
    if (err) cb(err);
    else if (exists) db.save(designPath, design, cb);
    else {
      db.create((err) => {
        if (err) cb(err);
        else db.save(designPath, design, cb);
      });
    }
  });
}
