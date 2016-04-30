'use strict';

const uuid = require('uuid');

function dbObjectFactory(dbObject) {

  dbObject = typeof dbObject === 'object' ? dbObject : {};

  Object.assign(dbObject, {

    _id: dbObject.hasOwnProperty('_id') ? dbObject._id : uuid.v4(),

    toString() {
      return JSON.stringify(dbObject);
    },

    toJSON() {
      return Object.keys(dbObject).reduce((obj, key) => {
        if (typeof dbObject[key] !== 'function' && ['_id', '_rev'].indexOf(key) === -1) obj[key] = dbObject[key];
        return obj;
      }, {});
    }

  });

  return dbObject;

}

module.exports = dbObjectFactory;
