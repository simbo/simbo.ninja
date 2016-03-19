'use strict';

var path = require('path');

module.exports = [

  'rsync www to uberspace',

  function() {
    return this.gulp.src(this.paths.site.dest)
      .pipe(this.plugins.rsync({
        root: path.relative(this.paths.cwd, this.paths.site.dest),
        destination: this.paths.remote.www,
        hostname: this.uberspace.host,
        username: this.uberspace.user,
        exclude: [
          '/contact',
          '/blog'
        ],
        incremental: true,
        recursive: true,
        progress: true,
        clean: false
      }));
  }

];
