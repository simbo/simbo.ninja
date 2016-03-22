'use strict';
/**
 * exports marked with custom code highlighter
 */

var marked = require('marked');

var highlightCode = require('../functions/highlight-code');

var markedOptions = {
  renderer: new marked.Renderer()
};

markedOptions.renderer.code = highlightCode;

marked.setOptions(markedOptions);

module.exports = marked;
