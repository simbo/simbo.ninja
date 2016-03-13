'use strict';

var fs = require('fs'),
    path = require('path');

var Q = require('q'),
    through = require('through2');

var renderJade = require('../../../app/functions/render-jade'),
    renderMarkdown = require('../../../app/functions/render-markdown');

var layoutCache = {};

module.exports = function(options) {

  return through.obj(transform);

  function transform(file, enc, cb) {
    if ((/\.(md|markdown)$/i).test(file.history[0])) {
      file.contents = new Buffer(renderMarkdown(String(file.contents)));
    }
    if ((/\.jade$/i).test(file.history[0])) {
      options.jade.filename = file.history[0];
      file.contents = new Buffer(renderJade(String(file.contents), options.jade, file.data));
    }
    if (!file.data.hasOwnProperty('layout')) {
      file.data.layout = options.layout.default;
    }
    if (file.data.layout) applyLayout(file, cb);
    else cb(null, file);
  }

  function applyLayout(file, cb) {
    getLayout(file.data.layout).done(function(layout) {
      if (layout) {
        file.data.contents = String(file.contents);
        options.jade.filename = layout.path;
        file.contents = new Buffer(renderJade(layout.contents, options.jade, file.data));
      }
      cb(null, file);
    }, cb);
  }

  function getLayout(layout) {
    return Q.Promise(function(resolve, reject) {
      var layoutPath = path.join(options.layout.path, layout);
      if (layoutCache[layoutPath]) {
        resolve(layoutCache[layoutPath]);
      } else {
        Q.nfapply(fs.readFile, [layoutPath, 'utf8']).done(function(layoutContents) {
          if (typeof layoutContents === 'string' && layoutContents.length > 0) {
            layoutCache[layoutPath] = {
              contents: layoutContents,
              path: layoutPath
            };
          }
          resolve(layoutCache[layoutPath]);
        }, reject);
      }
    });
  }

};
