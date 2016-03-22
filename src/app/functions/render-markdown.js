'use strict';

var marked = require('../modules/marked');

module.exports = renderMarkdown;

function renderMarkdown(str) {
  return marked(str);
}
