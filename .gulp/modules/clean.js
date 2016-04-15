'use strict';

const del = require('del');

function clean(glob, done) {
  del(glob).then((files) => {
    this.util.log(`${this.util.colors.red('✘')} Deleted ${files.length} item${files.length === 1 ? '' : 's'}.`);
    done();
  });
}

module.exports = clean;
