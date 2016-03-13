'use strict';

var clean = require('../../modules/clean');

module.exports = [

  'clean generated css',

  function(done) {
    clean.apply(this, [[
      this.paths.css.dest
    ], done]);
  }

];
