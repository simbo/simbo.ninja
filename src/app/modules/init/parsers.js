'use strict';

var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash');

module.exports = initParsers;

function initParsers(app) {

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(flash());

  return app;

}
