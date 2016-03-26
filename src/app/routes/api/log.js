'use strict';

var async = require('async'),
    router = require('express').Router();

var couch = require('app/modules/couch');

var db = couch.database('log');

router.get('/latest', function(req, res, next) {

  var viewOptions = {
    descending: true
  };

  if (req.query.hasOwnProperty('after')) {
    viewOptions.endkey = req.query.after;
    viewOptions.inclusive_end = false;
  } else {
    viewOptions.limit = req.query.hasOwnProperty('limit') ?
      parseInt(req.query.limit, 10) : 50;
  }

  db.view('log/byTimestamp', viewOptions, function(err, results) {
    if (err) return next(err);
    res.send({
      entries: results.map(getEntryFromDoc)
    });
  });

});

router.get('/clear', function(req, res, next) {

  db.view('log/byId', function(err, results) {
    if (err) next(err);
    else {
      async.each(results, function(row, cb) {
        db.remove(row.key, row.value._rev, function(err) {
          if (err) cb(err);
          cb();
        });
      }, function(err) {
        if (err) next(err);
        else res.send(true);
      });
    }
  });

});

module.exports = router;

function getEntryFromDoc(docValue) {
  var entry = docValue.params;
  entry.id = docValue._id;
  return entry;
}
