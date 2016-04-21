'use strict';

/**
 * init/routes
 * ===========
 * exports initialization function for routes
 */

const path = require('path');

const async = require('async'),
      q = require('q');

const config = require('config'),
      logger = require('app/modules/logger');

/**
 * app routes
 * reduce routes array to an array containing only valid route objects
 * @type {Array}
 */
const routes = config.app.routes.reduce((routesArr, route) => {
  if (typeof route === 'string') route = [route];
  if (Array.isArray(route)) route = {path: route[0], module: route[1] || route[0]};
  if (typeof route === 'object' && route.path && route.path.length) {
    routesArr.push({
      path: String(route.path).replace(/^([^\/])/i, '/$1'),
      module: String(route.module || route.path)
    });
  }
  return routesArr;
}, []);

module.exports = {
  routes,
  initRoutes
};

/**
 * require and use the configured route modules at respective paths
 * @param  {Object}  app express app
 * @return {Promise}     app
 */
function initRoutes(app) {
  return q.Promise((resolve, reject) => {
    async.each(routes, (route, cb) => {
      const routeRequirePath = path.join(config.paths.app, 'routers', route.module);
      try {
        app.use(route.path, require(routeRequirePath));
        logger.log('verbose', 'applied router module %s to %s', route.module, route.path);
        cb();
      } catch (err) {
        cb(err);
      }
    }, (err) => {
      if (err) reject(err);
      else resolve(app);
    });
  });
}
