'use strict';

global.$ = require('cash-dom');
global.jQuery = $;

$(document).ready(function() {

  if ('ontouchstart' in document.documentElement) {
    $('html').addClass('is-touch');
  }

  require('components/typed').init();

});
