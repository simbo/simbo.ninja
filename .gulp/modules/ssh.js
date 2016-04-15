'use strict';

const childProcess = require('child_process');

const arrayify = require('arrayify'),
      gUtil = require('gulp-util');

const config = require('config');

function ssh(commands, done) {

  const args = [
          `${config.uberspace.user}@${config.uberspace.host}`,
          arrayify(commands).join(';')
        ],
        cmd = childProcess.spawn('ssh', args, {
          cwd: config.paths.cwd
        });

  cmd.stdout.on('data', (data) => {
    gUtil.log(String(data));
  });

  cmd.stderr.on('data', (data) => {
    gUtil.log(String(data));
  });

  cmd.on('close', (code) => {
    done();
  });

}

module.exports = ssh;
