'use strict';

var path = require('path');

var ssh = require('../../modules/ssh');

var paths = require('../../../src/config/paths');

module.exports = [

  'copy private config and install node_modules',

  function(done) {
    ssh([
      'source ~/.bash_profile &> /dev/null',
      'cp -fa ' + paths.remote.config.src + '/* ' + paths.remote.config.dest,
      'cd ' + path.join(paths.remote.root, 'src'),
      'npm install --production'
    ], done);
  }

];
