'use strict';

/**
 * init/routes
 * ===========
 * exports initialization function for routes
 */

var path = require('path');

var async = require('async'),
    Q = require('q');

var config = require('config'),
    logger = require('app/modules/logger');

/**
 * app routes
 * reduce routes array to an array containing only valid route objects
 * @type {Array}
 */
var routes = config.app.routes.reduce(function(routes, route) {
  if (typeof route === 'string') route = [route];
  if (Array.isArray(route)) route = {path: route[0], module: route[1] || route[0]};
  if (typeof route === 'object' && route.path && route.path.length) {
    routes.push({
      path: String(route.path).replace(/^([^\/])/i, '/$1'),
      module: String(route.module || route.path)
    });
  }
  return routes;
}, []);

module.exports = initRoutes;

/**
 * require and use the configured route modules at respective paths
 * @param  {Object}  app express app
 * @return {Promise}     app
 */
function initRoutes(app) {
  return Q.Promise(function(resolve, reject) {
    async.each(routes, function(route, cb) {
      var routeRequirePath = path.join(config.paths.app, 'routes', route.module);
      try {
        app.use(route.path, require(routeRequirePath));
      } catch (err) {
        cb(err);
      }
      logger.log('verbose', 'created route %s using module %s', route.path, route.module);
      cb();
    }, function(err) {
      if (err) reject(err);
      else resolve(app);
    });
  });
}


