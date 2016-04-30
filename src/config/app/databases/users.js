'use strict';

/**
 * database layout for 'users'
 * @type {Object}
 */
module.exports = {

  views: {

    byId: {
      map: function(doc) {
        if (doc.username) emit(doc._id, doc);
      }
    },

    byUsername: {
      map: function(doc) {
        if (doc.username) emit(doc.username, doc);
      }
    },

    byEmail: {
      map: function(doc) {
        if (doc.email) emit(doc.email, doc);
      }
    },

    byFlag: {
      map: function(doc) {
        if (doc.flags) {
          doc.flags.forEach(function(flag) {
            emit(flag, doc);
          });
        }
      }
    }

  }

};
