'use strict';

/**
 * database layout for 'users'
 * @type {Object}
 */
module.exports = {

  views: {

    byId: {
      map: function(doc) {
        if (doc.resource === 'log') {
          doc.params.id = doc._id;
          emit(doc._id, doc);
        }
      }
    },

    byTimestamp: {
      map: function(doc) {
        if (doc.resource === 'log') {
          emit(doc.params.timestamp, doc);
        }
      }
    }

  }

};
