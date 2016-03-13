'use strict';

module.exports = [

  'set environment to \'production\'',

  function(done) {
    this.env = 'production';
    done();
  }

];
