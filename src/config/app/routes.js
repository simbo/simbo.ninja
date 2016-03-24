'use strict';

var path = require('path');

var paths = require('../paths');

/**
 * app routes
 * a route can be defined by
 *   - a plain object, containg a route path and an optional module path.
 *     if no module path given, route path is used.
 *     example:
 *     ```
 *     {
 *       path: 'foo', // creates route "/foo"
 *       module: 'bar' // requires module "./app/routes/bar"
 *     }
 *     ```
 *   - an array, containing a path and an optional module, used to generate
 *     described object
 *   - a string, used to generate described object
 *
 * @type {Array}
 */
var routes = [
  'api/status',
  'log',
  'api/log'
];

/**
 * export app routes
 * reduce routes array to an array containing only valid route objects
 *
 * @type {Array}
 */
module.exports = routes.reduce(function(appRoutes, route) {
  if (typeof route === 'string') {
    route = {path: route};
  }
  if (Array.isArray(route) && route.length === 2) {
    route = {path: route[0], module: route[1]};
  }
  if (typeof route === 'object' && route.path && route.path.length) {
    appRoutes.push({
      path: String(route.path).replace(/^([^\/])/i, '/$1'),
      module: String(route.module || route.path)
    });
  }
  return appRoutes;
}, []);
