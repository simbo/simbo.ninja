'use strict';

/**
 * marked
 * ======
 * exports marked with highlight.js as code renderer
 */

var marked = require('marked'),
    highlightjs = require('highlight.js');

var markedOptions = {
  renderer: new marked.Renderer()
};

/**
 * highlight code using highlight.js
 * @param  {String} code code string
 * @param  {String} lang language key
 * @return {String}      rendered html
 */
markedOptions.renderer.code = function(code, lang) {
  lang = typeof lang === 'string' && highlightjs.getLanguage(lang) ? lang : false;
  code = lang ? highlightjs.highlight(lang, code).value : highlightjs.highlightAuto(code).value;
  return '<pre><code class="hljs' + (lang ? ' lang-' + lang : '') + '">' + code + '</code></pre>';
};

marked.setOptions(markedOptions);

/**
 * export marked
 * @type {Function}
 */
module.exports = marked;
