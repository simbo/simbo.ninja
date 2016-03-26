'use strict';

var http = require('http');

var io = require('socket.io');

module.exports = populate;

function populate(app) {

  app.server = http.Server(app);
  app.io = io(app.server);

  return app;

}
