'use strict';

var path = require('path');

var async = require('async'),
    Q = require('q');

var config = require('config'),
    logger = require('app/modules/logger');

/**
 * app routes
 * reduce routes array to an array containing only valid route objects
 *
 * @type {Array}
 */
var routes = config.app.routes.reduce(function(routes, route) {
  if (typeof route === 'string') {
    route = {path: route};
  }
  if (Array.isArray(route) && route.length === 2) {
    route = {path: route[0], module: route[1]};
  }
  if (typeof route === 'object' && route.path && route.path.length) {
    routes.push({
      path: String(route.path).replace(/^([^\/])/i, '/$1'),
      module: String(route.module || route.path)
    });
  }
  return routes;
}, []);


module.exports = setupRoutes;

function setupRoutes(app) {

  var deferred = Q.defer();

  async.each(routes, function(route, cb) {

    var routeRequirePath = '../../' + path.join('routes', route.module);
    app.use(route.path, require(routeRequirePath));
    logger.log('verbose', 'created route %s using module %s', route.path, route.module);
    cb();

  }, function(err) {

    if (err) deferred.reject(new Error(err));
    else deferred.resolve(app);

  });

  return deferred.promise;

}
