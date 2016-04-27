'use strict';

const bcrypt = require('bcrypt'),
      q = require('q');

const flaggableFactory = require('app/factories/flaggable'),
      userRepo = require('app/repositories/user'),
      validator = require('app/modules/validator');

function userFactory(user) {

  user = typeof user === 'object' ? user : {};

  user = flaggableFactory(user);

  Object.assign(user, {

    toString() {
      return user.username;
    },

    toJSON() {
      return {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        flags: user.flags
      };
    },

    setUsername(str) {
      return q(str)
        .then(validator.validate('username'))
        .then((name) => userRepo.usernameNotTaken(name, user.uuid))
        .then((name) => {
          user.username = name;
          return user;
        });
    },

    setEmail(str) {
      return q(str)
        .then(validator.validate('email'))
        .then((email) => userRepo.emailNotTaken(email, user.uuid))
        .then((email) => {
          user.email = email;
          return user;
        });
    },

    setPassword(str) {
      return q(str)
        .then(validator.is('password'))
        .then((password) => q.Promise((resolve, reject) => {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) reject(err);
            else resolve(hash);
          });
        }))
        .then((hash) => {
          user.passwordHash = hash;
          return user;
        });
    },

    verifyPassword(str) {
      return q.Promise((resolve, reject) => {
        bcrypt.compare(str, user.passwordHash, (err, res) => {
          if (err) reject(err);
          else if (!res) reject(new Error('wrong password'));
          else resolve(this);
        });
      });
    }

  });

  return user;

}

module.exports = userFactory;
