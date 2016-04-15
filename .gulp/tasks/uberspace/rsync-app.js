'use strict';

const path = require('path');

module.exports = [

  'rsync src to uberspace',

  function() {
    return this.gulp.src([
      path.join(this.paths.src, '**/*')
    ])
      .pipe(this.plugins.rsync({
        root: this.paths.src,
        destination: path.join(this.paths.remote.root, 'src'),
        hostname: this.uberspace.host,
        username: this.uberspace.user,
        incremental: true,
        progress: true
      }));
  }

];
