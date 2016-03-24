'use strict';

module.exports = {

  views: {

    paramsByTimestamp: {
      map: function(doc) {
        if (doc.resource === 'log') {
          emit(doc.params.timestamp, doc.params);
        }
      }
    },

    byId: {
      map: function(doc) {
        if (doc.resource === 'log') {
          emit(doc.id, doc);
        }
      }
    }

  }

};
