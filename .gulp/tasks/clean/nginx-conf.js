'use strict';

const clean = require('../../modules/clean');

module.exports = [

  'clean generated nginx config',

  function(done) {
    Reflect.apply(clean, this, [[
      this.paths.nginx.dest
    ], done]);
  }

];
