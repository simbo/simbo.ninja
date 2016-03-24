'use strict';

var fs = require('fs');

var merge = require('merge'),
    Q = require('q'),
    ReqMapper = require('requirements-mapper');

var config = require('config'),
    jade = require('app/modules/jade'),
    renderJade = require('app/functions/render-jade');

var data = new ReqMapper(config.paths.data),
    templateCache = {};

jade.__express = render;

module.exports = setupViews;

function setupViews(app) {
  app.locals = merge({}, app.locals, data.map());
  app.engine('jade', jade.__express);
  app.set('views', config.paths.views);
  app.set('view engine', 'jade');
  return app;
}

function render(templatePath, options, cb) {
  getTemplate(templatePath)
    .done(function(template) {
      options.filename = template.path;
      options.basedir = config.paths.site.src;
      options.pretty = process.env.NODE_ENV === 'development';
      cb(null, renderJade(template.contents, options));
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
