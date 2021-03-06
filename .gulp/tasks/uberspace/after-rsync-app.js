'use strict';

const path = require('path');

const ssh = require('../../modules/ssh');

const config = require('config');

module.exports = [

  'copy private config and install node_modules',

  function(done) {
    ssh([
      'source ~/.bash_profile &> /dev/null',
      `cp -fa ${config.paths.remote.config.src}/* ${config.paths.remote.config.dest}`,
      `cd ${path.join(config.paths.remote.root, 'src')}`,
      'npm install --production'
    ], done);
  }

];
