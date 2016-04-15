'use strict';

const ssh = require('../../modules/ssh');

module.exports = [

  'apply nginx config on uberspace',

  function(done) {
    ssh('~/bin/nginx -s reload', done);
  }

];
