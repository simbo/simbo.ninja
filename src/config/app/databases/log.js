'use strict';

module.exports = {

  views: {

    byTimestamp: {
      map: function(doc) {
        if (doc.resource === 'log') {
          emit(doc.params.timestamp, doc.params);
        }
      }
    }

  }

};
