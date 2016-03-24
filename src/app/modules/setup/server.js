'use strict';

var config = require('config'),
    logger = require('app/modules/logger');

module.exports = setupServer;

function setupServer(app) {
  var server = app.listen(
    config.app.server.port,
    config.app.server.host,
    function() {
      var address = server.address();
      logger.log('info', 'server started (listening on %s:%s)', address.address, address.port);
    }
  );
  return app;
}
