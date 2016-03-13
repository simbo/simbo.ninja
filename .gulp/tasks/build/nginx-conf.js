'use strict';

var path = require('path');

module.exports = [

  'generate nginx config for uberspace',

  function() {
    return this.gulp
      .src(path.join(this.paths.nginx.src, '**/*'))
      .pipe(this.plugins.replace('/etc/nginx', this.paths.remote.nginx))
      .pipe(this.plugins.replace('/vagrant/dest/www', this.paths.remote.www))
      .pipe(this.plugins.replace('daemon on', 'daemon off'))
      .pipe(this.gulp.dest(this.paths.nginx.dest));
  }

];
