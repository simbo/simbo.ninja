'use strict';

var path = require('path');

var async = require('async'),
    Q = require('q');

var config = require('../../../config'),
    logger = require('../logger');

module.exports = setupRoutes;

function setupRoutes(app) {

  var deferred = Q.defer();

  async.each(config.app.routes, function(route, cb) {

    var routeRequirePath = '..' + path.join(path.sep, 'routes', route.module);
    app.use(route.path, require(routeRequirePath));
    logger.log('verbose', 'created route %s using module %s', route.path, route.module);
    cb();

  }, function(err) {

    if (err) deferred.reject(new Error(err));
    else deferred.resolve(app);

  });

  return deferred.promise;

}
