'use strict';

const clean = require('../modules/clean');

module.exports = [

  'clean dest path completely',

  function(done) {
    Reflect.apply(clean, this, [[
      this.paths.dest
    ], done]);
  }

];
