'use strict';

var path = require('path');

var moment = require('moment'),
    through = require('through2');

module.exports = function() {
  return through.obj(transformDate);
};

/**
 * set a valid moment object on file.data.date, using the date value from
 * file.data.date, filename or file.stat.mtime
 * @param  {File}     file  vinyl file object
 * @param  {String}   enc   file encoding
 * @param  {Function} done  callback
 * @return {undefined}
 */
function transformDate(file, enc, done) {
  if (!file.data.hasOwnProperty('date')) dateFromFilename(file);
  file.data.date = moment(file.data.date);
  done(null, file);
}

/**
 * extract/remove date from filename; change file object in place
 * @param  {File} file  vinyl file object
 * @return {undefined}
 */
function dateFromFilename(file) {
  var fileName = path.basename(file.relative),
      regexpDateFilename = /^([0-9]{4}\-[0-9]{2}\-[0-9]{2})\-(.+)/i,
      regexpResult = regexpDateFilename.exec(fileName);
  if (regexpResult) {
    file.data.date = regexpResult[1];
    file.path = path.join(path.dirname(file.path), regexpResult[2]);
  }
}
