'use strict';

var fs = require('fs'),
    path = require('path');

var merge = require('merge'),
    Q = require('q'),
    through = require('through2');

var pug = require('app/modules/pug'),
    marked = require('app/modules/marked');

var layoutCache = {};

module.exports = renderSite;

function renderSite(options) {

  return through.obj(transform);

  function transform(file, enc, done) {
    if ((/\.pug$/i).test(file.history[0])) {
      options.pug.filename = file.history[0];
      file.contents = new Buffer(pug.render(String(file.contents), merge({}, options.pug, file.data)));
    } else if ((/\.(md|markdown)$/i).test(file.history[0])) {
      file.contents = new Buffer(marked(String(file.contents)));
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
        options.pug.filename = layout.path;
        file.contents = new Buffer(pug.render(layout.contents, merge({}, options.pug, file.data)));
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
