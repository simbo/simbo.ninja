'use strict';

const multimatch = require('multimatch'),
      streamfilter = require('streamfilter');

module.exports = filter;

/**
 * create a stream filter by globbing original file paths
 * @param  {mixed}  test      glob string/array or function
 * @param  {object} options   minimatch options
 * @return {object}           stream transform handler
 */
function filter(test) {
  return streamfilter(typeof test === 'function' ? test : (file, enc, done) => {
    const match = multimatch(file.history[0], test).length > 0;
    done(!match);
  }, {
    objectMode: true,
    passthrough: true,
    restore: true
  });
}
