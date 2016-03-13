'use strict';

var path = require('path');

var autoprefixer = require('autoprefixer'),
    csswring = require('csswring'),
    glob = require('glob'),
    lost = require('lost'),
    mqpacker = require('css-mqpacker');

module.exports = ['parse stylus to css, pipe through postcss', buildCss];

/**
 * gulp task for building css
 * @return {Object} gulp stream
 */
function buildCss() {

  var src = this.paths.css.src,
      dest = this.paths.css.dest,
      options = {
        stylint: {
          config: path.join(this.paths.css.src, '.stylintrc')
        },
        stylus: {
          'include css': true,
          paths: [
            path.join(this.paths.css.src, 'imports'),
            this.paths.static,
            path.join(this.paths.cwd, 'node_modules')
          ],
          url: {
            name: 'inline-url',
            limit: false
          },
          use: glob.sync(path.join(this.paths.css.src, 'functions', '**/*.js'))
            .map(function(fn) {
              return require(path.relative(__dirname, fn))();
            })
        },
        autoprefixer: {
          browsers: [
            'last 2 versions',
            '> 0.25%'
          ]
        },
        csswring: {
          preserveHacks: true
        },
        sourcemaps: {
          includeContent: true,
          sourceRoot: '.'
        }
      };

  return this.gulp
    .src(path.join(src, '*.styl'))
    .pipe(this.plugins.plumber())
    .pipe(this.plugins.sourcemaps.init())
    .pipe(this.plugins.stylint(options.stylint))
    .pipe(this.plugins.stylint.reporter())
    .pipe(this.env === 'development' ? this.util.noop : this.plugins.stylint.reporter('fail'))
    .pipe(this.plugins.stylus(options.stylus))
    .pipe(this.plugins.postcss([
      lost(),
      autoprefixer(options.autoprefixer),
      mqpacker
    ].concat(this.env !== 'development' ? [
      csswring(options.csswring)
    ] : [])))
    .pipe(this.plugins.sourcemaps.write('.', options.sourcemaps))
    .pipe(this.gulp.dest(dest))
    .on('end', this.reload);

}
