'use strict';

const clean = require('../../modules/clean');

module.exports = [

  'clean generated javascripts',

  function(done) {
    clean.apply(this, [[
      this.paths.js.dest
    ], done]);
  }

];
