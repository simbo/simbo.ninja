'use strict';

const q = require('q');

const repoFactory = require('app/factories/repository'),
      validator = require('app/modules/validator');

const userRepo = repoFactory('users');

userRepo.oneByUsername = (username) => q(username)
  .then(validator.validate('username'))
  .then((name) => userRepo.one('byUsername', name));

userRepo.oneByEmail = (email) => q(email)
  .then(validator.validate('email'))
  .then((addr) => userRepo.one('byEmail', addr));

userRepo.usernameNotTaken = (username, excludeId) => userRepo.keyNotTaken('byUsername', username, excludeId);

userRepo.emailNotTaken = (email, excludeId) => userRepo.keyNotTaken('byEmail', email, excludeId);

module.exports = userRepo;
