'use strict';

var jade = require('jade');

jade.filters.markdown = require('../functions/render-markdown');

jade.filters.uglify = require('../functions/uglify-js');

module.exports = jade;
