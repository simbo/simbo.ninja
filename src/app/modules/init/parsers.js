'use strict';

var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

module.exports = initParsers;

function initParsers(app) {

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  return app;

}
