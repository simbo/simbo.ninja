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

  latest(limit) {
    return logRepo.view('byTimestamp', {
      limit: limit ? parseInt(limit, 10) : 50,
      descending: true
    });
  }

});

module.exports = logRepo;
