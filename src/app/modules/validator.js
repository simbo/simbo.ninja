'use strict';

const q = require('q'),
      vldtr = require('validator');

const types = {

  uuid: (val) => vldtr.isUUID(val, 4),

  email: (val) => vldtr.isEmail(val),

  username: (val) => typeof val === 'string' && (/^[a-z0-9_-]{1,32}$/i).test(val),

  password: (val) => typeof val === 'string' && val.length >= 10,

  flag: (val) => typeof val === 'string' && (/^[a-z0-9_-]+$/).test(val)

};

const validator = {

  is(type, subject) {
    if (types.hasOwnProperty(type)) return types[type](subject);
    throw new Error(`unknown type '${type}'`);
  },

  validate(type) {
    return (subject) => q.Promise((resolve, reject) => {
      if (validator.is(type, subject)) resolve(subject);
      else reject(new Error(`invalid ${type} '${subject}'`));
    });
  }

};

module.exports = validator;
