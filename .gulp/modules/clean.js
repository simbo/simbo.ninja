'use strict';

var del = require('del');

function clean(glob, done) {
  del(glob).then(function(files) {
    this.util.log(
      this.util.colors.red('✘') +
      ' Deleted ' + files.length +
      ' item' + (files.length === 1 ? '' : 's') + '.'
    );
    done();
  }.bind(this));
}

module.exports = clean;
