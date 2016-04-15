'use strict';

/**
 * database layout for 'users'
 * @type {Object}
 */
module.exports = {

  views: {

    byId: {
      map: function(doc) {
        emit(doc.uuid, doc);
      }
    },

    byUsername: {
      map: function(doc) {
        emit(doc.username, doc);
      }
    },

    byEmail: {
      map: function(doc) {
        emit(doc.email, doc);
      }
    },

    byFlag: {
      map: function(doc) {
        doc.flags.forEach(function(flag) {
          emit(flag, doc);
        });
      }
    }

  }

};
