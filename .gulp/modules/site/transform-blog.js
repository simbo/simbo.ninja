'use strict';

var path = require('path');

var slug = require('slug'),
    through = require('through2');

var slugOptions = {
  mode: 'rfc3986'
};

module.exports = function() {
  return through.obj(transformBlog);
};

/**
 * transform the file object to create a blog collection
 * @param  {File}      file  vinyl file object
 * @param  {String}    enc   file encoding
 * @param  {Function}  done  callback
 * @return {undefined}
 */
function transformBlog(file, enc, done) {

  // set blog article urls using date and titles
  var fileSlug = file.data.slug || file.data.title ||
        path.basename(file.history[0]).replace(/^([0-9]{4}-[0-9]{2}-[0-9]{2}-)(.*)(.(md|pug|html))$/i, '$2'),
      fileDatePath = file.data.date.format('YYYY/MM');
  file.path = path.join(file.base, 'blog', fileDatePath, slug(fileSlug, slugOptions), 'index.html');

  done(null, file);

}
