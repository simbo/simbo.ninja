'use strict';

var path = require('path');

var browserifyShim = require('browserify-shim'),
    eslintify = require('eslintify'),
    uglifyify = require('uglifyify');

module.exports = ['bundle javascripts using watchify+browserify', buildJs];

/**
 * gulp task for building js
 * @param  {Function} done  callback
 * @return {Object}         gulp stream
 */
function buildJs(done) {

  var options = {
    watch: this.watchify,
    cwd: this.paths.js.src,
    browserify: {
      paths: [
        path.join(this.paths.js.src, 'modules'),
        path.join(this.paths.cwd, 'node_modules')
      ],
      debug: this.env !== 'development',
      transform: (this.env !== 'development' ? [eslintify] : [])
        .concat([browserifyShim])
        .concat(this.env !== 'development' ? [[uglifyify, {global: true}]] : [])
    }
  };

  this.plugins.watchifyBrowserify('*.js', options, streamHandler.bind(this), done);

  function streamHandler(stream) {
    return stream
      .pipe(this.plugins.plumber())
      .pipe(this.plugins.sourcemaps.init({loadMaps: true}))
      .pipe(this.plugins.sourcemaps.write('.', {includeContent: true, sourceRoot: '.'}))
      .pipe(this.gulp.dest(this.paths.js.dest))
      .on('end', this.reload);
  }
}
