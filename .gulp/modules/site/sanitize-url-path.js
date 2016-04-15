'use strict';

const path = require('path');

const slug = require('slug');

const slugOptions = {
  mode: 'rfc3986'
};

module.exports = sanitizeUrlPath;

/**
 * convert file path into sanitized url path
 * @param  {[type]} filepath [description]
 * @return {[type]}          [description]
 */
function sanitizeUrlPath(filepath) {

  // sanitize all folder names in path
  filepath.dirname = path.relative('.', filepath.dirname)
    .split('/').map((part) => slug(part, slugOptions)).join('/');

  // sanitize file name
  filepath.basename = slug(filepath.basename, slugOptions);

  // rename content to html
  if ((/\.(md|pug)$/i).test(filepath.extname)) filepath.extname = '.html';

  // apply "pretty urls"
  if (filepath.basename !== 'index') {
    filepath.dirname = path.join(filepath.dirname, filepath.basename);
    filepath.basename = 'index';
  }

  return filepath;

}
