'use strict';

/**
 * renderer
 * ========
 * - exports marked with highlight.js as code renderer
 * - exports pug with custom filters
 * - exports renderView function to render app views
 * - exports highlighCode function to highlight source code
 */

const highlightjs = require('highlight.js'),
      marked = require('marked'),
      pug = require('pug'),
      ReqMapper = require('requirements-mapper'),
      uglify = require('uglify-js');

const config = require('config'),
      logger = require('app/modules/logger');

const staticData = new ReqMapper(config.paths.data);

const markedOptions = {
  renderer: new marked.Renderer()
};

markedOptions.renderer.code = highlightCode;
marked.setOptions(markedOptions);

pug.filters = pug.filters || {};
pug.filters.marked = marked;
pug.filters.uglify = (str) => uglify.minify(str, {fromString: true}).code;

module.exports = {
  highlightCode,
  marked,
  pug,
  renderView,
  init: initViews
};

/**
 * render an app view
 * @param  {String}   templatePath path to template file
 * @param  {Object}   options      template engine options
 * @param  {Function} cb           callback
 */
function renderView(templatePath, options, cb) {
  options.filename = templatePath;
  options.basedir = config.paths.site.src;
  pug.renderFile(templatePath, options, cb);
}

/**
 * highlight code using highlight.js
 * @param  {String} code code string
 * @param  {String} lang language key
 * @return {String}      rendered html
 */
function highlightCode(code, lang) {
  lang = typeof lang === 'string' && highlightjs.getLanguage(lang) ? lang : false;
  code = lang ? highlightjs.highlight(lang, code).value : highlightjs.highlightAuto(code).value;
  return `<pre><code class="hljs${ lang ? ` lang-${lang}` : '' }">${code}</code></pre>`;
}

function initViews(app) {
  app.locals = Object.assign({}, app.locals, staticData.map());
  app.engine('pug', renderView);
  app.set('views', config.paths.views);
  app.set('view engine', 'pug');
  logger.log('verbose', 'set up view engine');
  return app;
}
