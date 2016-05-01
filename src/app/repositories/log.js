'use strict';

const repoFactory = require('app/factories/repository');

const logRepo = repoFactory('log');

Object.assign(logRepo, {

  latestAfter(endkey) {
    return logRepo.view('byTimestamp', {
      endkey,
      inclusive_end: false,
      descending: true
    });
  },

  latest(limit = 50) {
    return logRepo.view('byTimestamp', {
      limit: parseInt(limit, 10),
      descending: true
    });
  }

});

module.exports = logRepo;
