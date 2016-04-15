'use strict';

/**
 * database layout for 'users'
 * @type {Object}
 */
module.exports = {

  views: {

    byTimestamp: {
      map: function(doc) {
        if (doc.resource === 'log') {
          emit(doc.params.timestamp, doc);
        }
      }
    },

    byId: {
      map: function(doc) {
        if (doc.resource === 'log') {
          emit(doc._id, doc);
        }
      }
    }

  }

};
