'use strict';

var path = require('path');

var moment = require('moment'),
    winston = require('winston');

var config = require('../../config');

var logger, loglevels;

winston.transports.DailyRotateFile = require('winston-daily-rotate-file');
winston.transports.Couchdb = require('winston-couchdb').Couchdb;

loglevels = {
  error:   [0, 'red'],
  warn:    [1, 'yellow'],
  info:    [2, 'blue'],
  verbose: [3, 'white'],
  debug:   [4, 'green'],
  silly:   [5, 'gray']
};

logger = new winston.Logger({

  levels: Object.keys(loglevels).reduce(function(levels, level) {
    levels[level] = loglevels[level][0];
    return levels;
  }, {}),

  exitOnError: false,

  transports: [

    new winston.transports.Console({
      silent: false,
      colorize: true,
      handleExceptions: true,
      timestamp: function() {
        return moment(new Date()).format('hh:mm:ss');
      },
      prettyPrint: function(meta) {
        var stack = meta.stack;
        return '\n' + (Array.isArray(stack) ? stack.join('\n') : stack);
      }
    }),

    new winston.transports.DailyRotateFile({
      silent: true,
      filename: path.join(config.paths.cwd, 'log', 'app'),
      datePattern: '.yyyy-MM-dd.log',
      handleExceptions: true
    }),

    new winston.transports.Couchdb({
      silent: false,
      host: config.app.couchdb.host,
      port: config.app.couchdb.port,
      db: 'log',
      auth: config.app.couchdb.connectionOptions.auth,
      handleExceptions: true
    })

  ]

});

winston.addColors(
  Object.keys(loglevels).reduce(function(levels, level) {
    levels[level] = loglevels[level][1];
    return levels;
  }, {})
);

module.exports = logger;
module.exports.loglevels = loglevels;
