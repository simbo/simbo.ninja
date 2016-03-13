'use strict';

var clean = require('../modules/clean');

module.exports = [

  'clean dest path completely',

  function(done) {
    clean.apply(this, [[
      this.paths.dest
    ], done]);
  }

];
