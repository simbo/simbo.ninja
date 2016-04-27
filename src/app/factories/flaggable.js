'use strict';

const q = require('q');

const validator = require('app/modules/validator');

function flaggableFactory(flaggable) {

  flaggable = typeof flaggable === 'object' ? flaggable : {};

  Object.assign(flaggable, {

    flags: flaggable.flags || [],

    hasFlag(str) {
      return flaggable.flags.indexOf(str) >= 0;
    },

    addFlag(str) {
      return q(str)
        .then(validator.validate('flag'))
        .then((flag) => {
          if (!flaggable.hasFlag(flag)) flaggable.flags.push(flag);
          return flaggable;
        });
    },

    removeFlag(str) {
      return q(str)
        .then(validator.validate('flag'))
        .then((flag) => {
          if (flaggable.hasFlag(flag)) flaggable.flags.splice(flaggable.flags.indexOf(flag), 1);
          return flaggable;
        });
    },

    verifyFlag(str) {
      return q.Promise((resolve, reject) => {
        if (flaggable.hasFlag(str)) resolve(flaggable);
        else reject(new Error('flag not present'));
      });
    }

  });

  return flaggable;

}

module.exports = flaggableFactory;
