'use strict';

var ssh = require('../../modules/ssh');

module.exports = [

  'apply nginx config on uberspace',

  function(done) {
    ssh('svc -du ~/service/nginx', done);
  }

];
