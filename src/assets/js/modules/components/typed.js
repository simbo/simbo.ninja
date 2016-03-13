'use strict';

require('typed.js');

module.exports = {
  init: initTyped
};

function initTyped(selector) {

  $(selector || '.typed').each(function() {

    var $container = $(this),
        $contentViews = $container.find('.typed-content_view'),
        speed = parseInt($container.data('speed'), 10),
        $content = $('<div class="typed-content"/>'),
        content = [];

    // find pause tags and replace them with pause strings
    $contentViews.find('[data-pause]').each(function() {
      var $el = $(this),
          duration = parseInt($el.data('pause'), 10),
          html = $.parseHTML('^' + duration);
      $el.after(html).remove();
    });

    // remove linebreaks, find br tags and replace them tih linebreaks
    $contentViews.each(function() {
      var $el = $(this),
          html = $el.html().replace(/[\n\r]/g, '').trim();
      $el.html(html);
    }).find('br').each(function() {
      var $el = $(this),
          html = $.parseHTML('\n');
      $el.after(html).remove();
    });

    // push content
    $contentViews.each(function() {
      content.push($(this).html());
    });

    // add a click event to cancel and finish typing animation
    $(document).on('click', function(ev) {
      var typed = $content.data('typed');
      if (!typed.timeout || ev.target.tagName === 'A') return true;
      ev.preventDefault();
      clearInterval(typed.timeout);
      $content.html(content[content.length - 1].replace(/\^[0-9]+/g, ''));
    });

    // insert $content into empty $container and start typing
    $content.appendTo($container.empty())
      .typed({
        strings: content,
        typeSpeed: speed,
        contentType: 'html',
        showCursor: false
      });

  });

}
