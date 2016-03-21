'use strict';

var path = require('path');

module.exports = [

  'rsync app and dependencies to uberspace',

  function() {
    return this.gulp.src([
      path.join(this.paths.app, '**/*'),
      path.join(this.paths.src, '**/*'),
      path.join(this.paths.config, '**/*'),
      path.join(this.paths.cwd, 'package.json')
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
