'use strict';

var jade = require('../modules/jade');

var cache = {};

module.exports = renderJade;

function renderJade(str, options, data) {
  var id = str + JSON.stringify(options);
  if (!cache.hasOwnProperty(id)) {
    cache[id] = jade.compile(str, options);
  }
  return cache[id](data);
}
