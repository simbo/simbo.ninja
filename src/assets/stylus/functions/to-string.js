'use strict';

/**
 * Convert given value to a string, remove surrounding quotes
 * (will still be quoted within stylus)
 * @return {function} stylus function definition
 */
function toString() {
  return function(style) {
    style.define('toString', function(val) {
      return val.toString().replace(/^('|")|('|")$/ig, '');
    });
  };
}

module.exports = toString;
