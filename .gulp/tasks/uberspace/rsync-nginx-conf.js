'use strict';

const path = require('path');

module.exports = [

  'rsync nginx config to uberspace',

  function() {
    return this.gulp.src(this.paths.nginx.dest)
      .pipe(this.plugins.rsync({
        root: path.relative(this.paths.cwd, this.paths.nginx.dest),
        destination: this.paths.remote.nginx,
        hostname: this.uberspace.host,
        username: this.uberspace.user,
        incremental: true,
        recursive: true,
        progress: true,
        clean: false
      }));
  }

];
