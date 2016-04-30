'use strict';

const q = require('q');

const repoFactory = require('app/factories/repository'),
      validator = require('app/modules/validator');

const userRepo = repoFactory('users');

Object.assign(userRepo, {

  oneByUsername(str) {
    return q(str)
      .then(validator.validate('username'))
      .then((username) => userRepo.one('byUsername', username));
  },

  oneByEmail(str) {
    return q(str)
      .then(validator.validate('email'))
      .then((email) => userRepo.one('byEmail', email));
  },

  viewByFlag(str, options) {
    return q(str)
      .then(validator.validate('flag'))
      .then((flag) => {
        options = typeof options === 'object' ? options : {};
        options.key = flag;
        return userRepo.view('byFlag', options);
      });
  },

  usernameNotTaken(str, excludeId) {
    return q(str)
      .then(validator.validate('username'))
      .then((username) => userRepo.keyNotTaken('byUsername', username, excludeId));
  },

  emailNotTaken(str, excludeId) {
    return q(str)
      .then(validator.validate('email'))
      .then((email) => userRepo.keyNotTaken('byEmail', email, excludeId));
  }

});

module.exports = userRepo;
