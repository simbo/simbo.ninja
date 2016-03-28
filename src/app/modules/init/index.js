'use strict';

var Q = require('q');

module.exports = init;

function init(app) {
  return Q(app)
    .then(require('./databases'))
    .then(require('./preparations'))
    .then(require('./sessions'))
    .then(require('./auth'))
    .then(require('./views'))
    .then(require('./routes'))
    .then(require('./errorhandling'))
    .done(require('./listen'));
}
