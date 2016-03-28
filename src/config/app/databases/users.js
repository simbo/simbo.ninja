'use strict';

module.exports = {

  views: {

    byUsername: {
      map: function(doc) {
        emit(doc.username, doc);
      }
    },

    byId: {
      map: function(doc) {
        emit(doc.uuid, doc);
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
