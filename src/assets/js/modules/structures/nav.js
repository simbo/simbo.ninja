'use strict';

module.exports = nav();

function nav() {

  $('.site-nav-toggle').each(function(i, el) {
    $(el).on('click', function(ev) {
      ev.preventDefault();
      global.$el.html.toggleClass('is_site-nav--visible');
    });
  });

}
