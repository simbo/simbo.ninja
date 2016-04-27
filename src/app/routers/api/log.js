'use strict';

const async = require('async'),
      router = require('express').Router();

const couch = require('app/modules/database').couch;

const db = couch.database('log');

router.get('/latest', (req, res, next) => {

  const viewOptions = {
    descending: true
  };

  if (req.query.hasOwnProperty('after')) {
    viewOptions.endkey = req.query.after;
    viewOptions.inclusive_end = false;
  } else {
    viewOptions.limit = req.query.hasOwnProperty('limit') ?
      parseInt(req.query.limit, 10) : 50;
  }

  db.view('log/byTimestamp', viewOptions, (err, results) => {
    if (err) return next(err);
    res.send({
      entries: results.map(getEntryFromDoc)
    });
  });

});

router.get('/clear', (req, res, next) => {

  db.view('log/byId', (err, results) => {
    if (err) next(err);
    else {
      async.each(results, (row, cb) => {
        db.remove(row.key, row.value._rev, (err) => {
          if (err) cb(err);
          cb();
        });
      }, (err) => {
        if (err) next(err);
        else res.send(true);
      });
    }
  });

});

module.exports = router;

function getEntryFromDoc(docValue) {
  const entry = docValue.params;
  entry.id = docValue._id;
  return entry;
}
