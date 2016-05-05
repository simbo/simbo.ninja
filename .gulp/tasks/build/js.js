'use strict';

const path = require('path');

const babelify = require('babelify'),
      eslintify = require('eslintify'),
      uglifyify = require('uglifyify');

module.exports = ['bundle javascripts using watchify+browserify', buildJs];

/**
 * gulp task for building js
 * @param  {Function} done  callback
 * @return {Object}         gulp stream
 */
function buildJs(done) {

  const options = {
    watch: this.watchify,
    cwd: this.paths.js.src,
    browserify: {
      paths: [
        path.join(this.paths.js.src, 'modules'),
        path.join(this.paths.cwd, 'node_modules')
      ],
      debug: this.env === 'development',
      transform: (this.env !== 'development' ? [eslintify] : [])
        .concat([[babelify, {
          presets: 'es2015',
          plugins: [
            'angular2-annotations',
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-flow-strip-types'
          ]
        }]])
        // .concat(this.env !== 'development' ? [[uglifyify, {
        //   global: true
        //   output: {
        //     comments: /^=(require|include)\s.+/
        //   }
        // }]] : [])
    }
  };

  this.plugins.watchifyBrowserify('*.js', options, (stream) => stream
    .pipe(this.plugins.plumber())
    .pipe(this.plugins.sourcemaps.init({loadMaps: true}))
    .pipe(this.plugins.include())
    .pipe(this.env !== 'development' ? this.plugins.uglify() : this.util.noop())
    .pipe(this.plugins.sourcemaps.write('.', {includeContent: true, sourceRoot: '.'}))
    .pipe(this.gulp.dest(this.paths.js.dest))
    .on('end', this.reload)
  , done);
}
