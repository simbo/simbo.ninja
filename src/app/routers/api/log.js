'use strict';

const router = require('express').Router();

const logRepo = require('app/repositories/log');

router.get('/latest', (req, res, next) => {

  (req.query.hasOwnProperty('after') ?
    logRepo.latestAfter(req.query.after) :
    logRepo.latest(req.query.limit)
  )
    .then((results) => {
      res.send({
        entries: results.map((result) => {
          result.params.id = result._id;
          return result.params;
        })
      });
    }, next);

});

router.get('/clear', (req, res, next) => {

  logRepo.clear()
    .then(() => {
      res.send(true);
    }, next);

});

module.exports = router;
