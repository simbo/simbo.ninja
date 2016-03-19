'use strict';

var fs = require('fs'),
    path = require('path');

var merge = require('merge'),
    Q = require('q'),
    ReqMapper = require('requirements-mapper');

var config = require('../../../config'),
    jade = require('../jade'),
    renderJade = require('../../functions/render-jade');

var data = (new ReqMapper(config.paths.data)).map(),
    templateCache = {};

jade.__express = render;

module.exports = setupViews;

function setupViews(app) {
  // app.locals = merge({}, app.locals, data.map());
  app.engine('jade', jade.__express);
  app.set('views', config.paths.views);
  app.set('view engine', 'jade');
  return app;
}

function render(templatePath, options, cb) {
  getTemplate(templatePath)
    .done(function(template) {
      var rendered = renderJade(
        template.contents,
        merge({}, options, {
          filename: template.path,
          basedir: config.paths.site.src,
          pretty: process.env.NODE_ENV === 'development'
        })
      );
      cb(null, rendered);
    });
}

function getTemplate(templatePath) {
  return Q.Promise(function(resolve, reject) {
    if (templateCache.hasOwnProperty(templatePath)) {
      resolve(templateCache[templatePath]);
    } else {
      Q.nfapply(fs.readFile, [templatePath, 'utf8']).done(function(template) {
        if (typeof template === 'string' && template.length > 0) {
          templateCache[templatePath] = {
            contents: template,
            path: templatePath
          };
        }
        resolve(templateCache[templatePath]);
      }, reject);
    }
  });
}
