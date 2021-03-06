'use strict';

/**
 * logger
 * ======
 * - exports winston logger with defined transports and settings
 * - exports loglevels object
 */

const path = require('path');

const moment = require('moment'),
      winston = require('winston');

const config = require('config');

winston.transports.DailyRotateFile = require('winston-daily-rotate-file');
winston.transports.Couchdb = require('winston-couchdb').Couchdb;

/**
 * loglevels: {name: [id, color], ...}
 * @type {Object}
 */
const loglevels = {
  error:   [0, 'red'],
  warn:    [1, 'yellow'],
  info:    [2, 'blue'],
  verbose: [3, 'white'],
  debug:   [4, 'green'],
  silly:   [5, 'gray']
};

/**
 * create winston logger instance
 * @type {Object}
 */
const logger = new winston.Logger({

  levels: Object.keys(loglevels).reduce((levels, level) => {
    levels[level] = loglevels[level][0];
    return levels;
  }, {}),

  exitOnError: false,

  transports: [

    // console transport options
    new winston.transports.Console({
      silent: false,
      colorize: true,
      level: 'silly',
      handleExceptions: true,
      timestamp: () => moment(new Date()).format('hh:mm:ss'),
      prettyPrint: (meta) => `\n${ Array.isArray(meta.stack) ? meta.stack.join('\n') : meta.stack }`
    }),

    // file transport options
    new winston.transports.DailyRotateFile({
      silent: true,
      level: 'info',
      filename: path.join(config.paths.cwd, 'log', 'app'),
      datePattern: '.yyyy-MM-dd.log',
      handleExceptions: true
    }),

    // couchdb transport options
    new winston.transports.Couchdb({
      silent: false,
      level: 'info',
      host: config.app.couchdb.host,
      port: config.app.couchdb.port,
      db: 'log',
      auth: {
        username: config.app.couchdb.username,
        password: config.app.couchdb.password
      },
      handleExceptions: true
    })

  ]

});

// set colors for loglevels
winston.addColors(
  Object.keys(loglevels).reduce((levels, level) => {
    levels[level] = loglevels[level][1];
    return levels;
  }, {})
);

module.exports = logger;
module.exports.loglevels = loglevels;
