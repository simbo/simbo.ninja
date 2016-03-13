'use strict';

var path = require('path');

module.exports = [

  'copy static files',

  function() {
    return this.gulp
      .src([
        '@(files)/**/*',
        '@(assets)/fonts/*/*.@(woff|svg|ttf)'
      ], {
        cwd: this.paths.static
      })
      .pipe(this.gulp.dest(this.paths.site.dest));
  }

];
