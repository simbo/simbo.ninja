'use strict';

/**
 * database layout for 'sessions'
 * @type {Object}
 */
module.exports = {

  views: {

    byId: {
      map: function(doc) {
        if (doc.collectionName === 'sessions') emit(doc._id, doc);
      }
    }

  }

};
