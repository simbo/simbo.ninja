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
 *   - a string, used to generate the object described before
 *
 * @type {Array}
 */
var routes = [
  "status"
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
  if (typeof route === 'object' && route.path && route.path.length) {
    appRoutes.push({
      path: String(route.path).replace(/^([^\/])/i, '/$1'),
      module: String(route.module || route.path)
    });
  }
  return appRoutes;
}, []);