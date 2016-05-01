'use strict';

const clean = require('../../modules/clean');

module.exports = [

  'clean generated javascripts',

  function(done) {
    Reflect.apply(clean, this, [[
      this.paths.js.dest
    ], done]);
  }

];
