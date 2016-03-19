'use strict';

var path = require('path');

module.exports = [

  'rsync app and dependencies to uberspace',

  function() {
    return this.gulp.src([
      this.paths.app,
      this.paths.src,
      this.paths.config,
      path.join(this.paths.cwd, 'package.json'),
      path.join(this.paths.cwd, 'pm2.json')
    ])
      .pipe(this.plugins.rsync({
        root: this.paths.cwd,
        destination: this.paths.remote.root,
        hostname: this.uberspace.host,
        username: this.uberspace.user,
        exclude: [],
        incremental: true,
        recursive: true,
        progress: true,
        clean: false
      }));
  }

];
