'use strict';

var path = require('path');

module.exports = [

  'rsync www to uberspace',

  function() {
    return this.gulp.src([
      path.join(this.paths.site.dest, '**/*'),
      '!' + path.join(this.paths.site.dest, '@(blog|contact)/**/*')
    ])
      .pipe(this.plugins.rsync({
        root: this.paths.dest,
        destination: path.join(this.paths.remote.root, 'dest'),
        hostname: this.uberspace.host,
        username: this.uberspace.user,
        progress: true,
        incremental: true
      }));
  }

];
