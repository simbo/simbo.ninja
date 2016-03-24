'use strict';

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

module.exports = routes;
