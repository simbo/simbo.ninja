'use strict';

var http = require('http');

var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    io = require('socket.io');

module.exports = prepare;

function prepare(app) {

  app.server = http.Server(app);
  app.io = io(app.server);

  app.use(cookieParser());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(flash());

  return app;

}
