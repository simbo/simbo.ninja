'use strict';

var uglify = require('uglify-js');

module.exports = uglifyJs;

/**
 * uglify a javascript string
 * @param  {string} str  source code string
 * @return {string}      html
 */
function uglifyJs(str) {
  return uglify.minify(str, {fromString: true}).code;
}
