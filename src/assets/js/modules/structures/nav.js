module.exports = nav();

function nav() {

  $('.site-nav-toggle').each((i, el) => {
    $(el).on('click', (ev) => {
      ev.preventDefault();
      global.$el.html.toggleClass('is_site-nav--visible');
    });
  });

}
