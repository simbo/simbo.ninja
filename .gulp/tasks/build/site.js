'use strict';

const path = require('path');

const filter = require('../../modules/filter'),
      render = require('../../modules/site/render'),
      sanitizeUrlPath = require('../../modules/site/sanitize-url-path'),
      transformDate = require('../../modules/site/transform-date'),
      transformBlog = require('../../modules/site/transform-blog');

module.exports = ['generate static site', buildSite];

/**
 * gulp task for building static site
 * @return {Object} gulp stream
 */
function buildSite() {

  const options = {
          pug: {
            basedir: this.paths.site.src,
            pretty: this.env === 'development'
          },
          layout: {
            default: 'base.pug',
            path: this.paths.layouts
          }
        },
        filters = {
          blog: filter(path.join(this.paths.content, 'blog/**/*'))
        };

  return this.gulp
    .src(path.join(this.paths.content, '**/*.@(md|markdown|pug|html)'))
    .pipe(this.plugins.plumber())
    .pipe(this.plugins.data(this.data.map()))
    .pipe(this.plugins.grayMatter())
    .pipe(transformDate())
    .pipe(this.plugins.rename(sanitizeUrlPath))
    .pipe(filters.blog)
      .pipe(transformBlog())
    .pipe(filters.blog.restore)
    .pipe(render(options))
    .pipe(this.gulp.dest(this.paths.site.dest))
    .on('end', this.reload);

}
