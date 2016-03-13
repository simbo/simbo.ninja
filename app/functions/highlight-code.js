'use strict';

var highlightjs = require('highlight.js');

module.exports = highlightCode;

/**
 * render string of code to highlighted code html structure
 * @param  {string} code  source code string
 * @param  {string} lang  source code language string
 * @return {string}       html
 */
function highlightCode(code, lang) {
  lang = typeof lang === 'string' && highlightjs.getLanguage(lang) ? lang : false;
  code = lang ? highlightjs.highlight(lang, code).value : highlightjs.highlightAuto(code).value;
  return '<pre><code class="hljs' + (lang ? ' lang-' + lang : '') + '">' + code + '</code></pre>';
}
