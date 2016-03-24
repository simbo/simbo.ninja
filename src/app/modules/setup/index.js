'use strict';

var Q = require('q');

module.exports = setup;

function setup(app) {
  return Q(app)
    .then(require('./databases'))
    .then(require('./sessions'))
    .then(require('./views'))
    .then(require('./routes'))
    .then(require('./errorhandling'))
    .done(require('./server'));
}
