'use strict';

var clean = require('../../modules/clean');

module.exports = [

  'clean generated site',

  function(done) {
    clean.apply(this, [[
      this.paths.site.dest
    ], done]);
  }

];
