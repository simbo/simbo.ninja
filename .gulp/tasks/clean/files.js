'use strict';

const path = require('path');

const clean = require('../../modules/clean');

module.exports = [

  'clean generated site',

  function(done) {
    Reflect.apply(clean, this, [[
      path.join(this.paths.site.dest, 'files'),
      path.join(this.paths.site.dest, 'assets/fonts')
    ], done]);
  }

];
