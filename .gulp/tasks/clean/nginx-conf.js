'use strict';

const clean = require('../../modules/clean');

module.exports = [

  'clean generated nginx config',

  function(done) {
    clean.apply(this, [[
      this.paths.nginx.dest
    ], done]);
  }

];
