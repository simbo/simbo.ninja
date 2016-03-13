'use strict';

var childProcess = require('child_process');

var arrayify = require('arrayify'),
    gUtil = require('gulp-util');

var config = require('../../config');

function ssh(commands, done) {

  var args = [
        config.uberspace.user + '@' + config.uberspace.host,
        arrayify(commands).join(';')
      ],
      cmd = childProcess.spawn('ssh', args, {
        cwd: config.paths.cwd
      });

  cmd.stdout.on('data', function(data) {
    gUtil.log(String(data));
  });

  cmd.stderr.on('data', function(data) {
    gUtil.log(String(data));
  });

  cmd.on('close', function(code) {
    done();
  });

}

module.exports = ssh;
