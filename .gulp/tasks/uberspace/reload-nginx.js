'use strict';

var ssh = require('../../modules/ssh');

module.exports = [

  'apply nginx config on uberspace',

  function(done) {
    ssh('nginx -s reload', done);
  }

];
