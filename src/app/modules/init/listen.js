'use strict';

var config = require('config'),
    logger = require('app/modules/logger');

module.exports = listen;

function listen(app) {
  app.server.listen(
    config.app.server.port,
    config.app.server.host,
    function() {
      var address = app.server.address();
      logger.log('info', 'server started (listening on %s:%s)', address.address, address.port);
    }
  );
  return app;
}
