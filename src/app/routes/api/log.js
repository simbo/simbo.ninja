'use strict';

var router = require('express').Router();

var couch = require('app/modules/couch');

router.get('/', function(req, res, next) {

  var db = couch.database('log'),
      viewOptions = {
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
      entries: results
    });
  });

});

module.exports = router;
