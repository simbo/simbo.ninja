'use strict';

module.exports = [

  'prepare a clean build and rsync to uberspace',

  function(done) {
    this.env = 'production';
    this.runSequence('build', 'uberspace:rsync-www', done);
  }

];
