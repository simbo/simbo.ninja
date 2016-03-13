'use strict';

global.$ = require('components/cash');
global.jQuery = $;

$(document).ready(function() {

  if ('ontouchstart' in document.documentElement) {
    $('html').addClass('is-touch');
  }

  require('components/typed').init();

});
