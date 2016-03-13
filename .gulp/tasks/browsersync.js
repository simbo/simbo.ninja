'use strict';

module.exports = [

  'start browser-sync',

  function() {
    this.browserSync({
      server: this.paths.site.dest,
      notify: false,
      open: false,
      ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
      }
    });
  }

];
