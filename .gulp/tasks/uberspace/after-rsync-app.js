'use strict';

var ssh = require('../../modules/ssh');

var paths = require('../../../config/paths');

module.exports = [

  'copy private config and install node_modules',

  function(done) {
    ssh([
      'source ~/.bash_profile &> /dev/null',
      'cp -fa ' + paths.remote.config.src + '/* ' + paths.remote.config.dest,
      'cd ' + paths.remote.root,
      'npm install --production'
    ], done);
  }

];
