'use strict';

module.exports = [

  'start browser-sync',

  function() {
    this.browserSync({
      proxy: '10.0.0.5:52323',
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
