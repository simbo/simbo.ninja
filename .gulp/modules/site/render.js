'use strict';

var fs = require('fs'),
    path = require('path');

var Q = require('q'),
    through = require('through2');

var renderJade = require('../../../src/app/functions/render-jade'),
    renderMarkdown = require('../../../src/app/functions/render-markdown');

var layoutCache = {};

module.exports = renderSite;

function renderSite(options) {

  return through.obj(transform);

  function transform(file, enc, done) {
    if ((/\.jade$/i).test(file.history[0])) {
      options.jade.filename = file.history[0];
      file.contents = new Buffer(renderJade(String(file.contents), options.jade, file.data));
    } else if ((/\.(md|markdown)$/i).test(file.history[0])) {
      file.contents = new Buffer(renderMarkdown(String(file.contents)));
    }
    if (!file.data.hasOwnProperty('layout')) {
      file.data.layout = options.layout.default;
    }
    if (file.data.layout) applyLayout(file, done);
    else done(null, file);
  }

  function applyLayout(file, done) {
    getLayout(file.data.layout).done(function(layout) {
      if (layout) {
        file.data.contents = String(file.contents);
        options.jade.filename = layout.path;
        file.contents = new Buffer(renderJade(layout.contents, options.jade, file.data));
      }
      done(null, file);
    }, done);
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

}
