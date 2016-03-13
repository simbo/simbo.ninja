'use strict';

var fs = require('fs'),
    path = require('path');

var Q = require('q');

module.exports = [

  'create symlinks for requiring custom modules from /node_modules',

  function(done) {

    var plug = this,
        symlinks = {
          app: path.join(this.paths.cwd, 'app'),
          config: path.join(this.paths.cwd, 'config'),
          src: path.join(this.paths.cwd, 'src')
        };

    Q.allSettled(Object.keys(symlinks).map(function(link) {
      var target = symlinks[link];
      link = path.join(plug.paths.cwd, 'node_modules', link);
      return Q.nfapply(fs.symlink, [target, link]);
    })).then(function(results) {
      var msg = '';
      results = results.reduce(function(results, result) {
        if (result.state === 'fulfilled') results.fulfilled++;
        else if (result.reason.code === 'EEXIST') results.rejected++;
        else throw result.reason;
        return results;
      }, {
        fulfilled: 0,
        rejected: 0
      });
      if (results.fulfilled) {
        msg += results.fulfilled + ' symlinks created';
      }
      if (results.rejected) {
        msg += results.rejected + ' symlinks skipped ' +
          plug.util.colors.gray('(file exists)');
      }
      plug.util.log(msg);
      done();
    });

  }

];
