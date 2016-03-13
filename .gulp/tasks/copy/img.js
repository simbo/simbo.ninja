'use strict';

var path = require('path');

module.exports = [

  'copy images',

  function() {
    return this.gulp
      .src(path.join(this.paths.static, '@(assets)/img/**/*.@(png|jpg|jpeg|gif)'))
      .pipe(this.plugins.newer(this.paths.site.dest))
      .pipe(this.plugins.smushit({
        verbose: true
      }))
      .pipe(this.gulp.dest(this.paths.site.dest));
  }

];
