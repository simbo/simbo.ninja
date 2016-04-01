'use strict';

/**
 * pug
 * ===
 * exports pug with custom filters
 */

var pug = require('pug'),
    uglify = require('uglify-js');

var config = require('config'),
    marked = require('app/modules/marked');

/**
 * render markdown using marked
 * @param  {String} markdown markdown content
 * @return {String}          rendered html
 */
pug.filters.marked = function(markdown) {
  return marked(markdown);
};

/**
 * minify javascript using uglify-js
 * @param  {String} str javascript code
 * @return {String}     rendered html
 */
pug.filters.uglify = function uglifyJs(str) {
  return uglify.minify(str, {fromString: true}).code;
};

module.exports = pug;
module.exports.renderView = renderView;

/**
 * render an app view
 * @param  {String}   templatePath path to template file
 * @param  {Object}   options      template engine options
 * @param  {Function} cb           callback
 */
function renderView(templatePath, options, cb) {
  options.filename = templatePath;
  options.basedir = config.paths.site.src;
  pug.renderFile(templatePath, options, cb);
}
