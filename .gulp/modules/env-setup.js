'use strict';

var environments = ['production', 'development'];

module.exports = envStatus;

function envStatus(plug) {

  // setter/getter for environment
  Object.defineProperty(plug, 'env', {
    get: function() {
      return process.env.NODE_ENV;
    },
    set: function(val) {
      if (environments.indexOf(val) !== -1) {
        process.env.NODE_ENV = val;
        plug.util.log('Environment: ' + plug.util.colors.yellow(plug.env));
      }
    }
  });

  plug.env = process.env.NODE_ENV;

  // add plain gulp task to set env to prod
  plug.gulp.task('env:prod', function() {
    plug.env = 'production';
  });

  // add plain gulp task to set env to dev
  plug.gulp.task('env:dev', function() {
    plug.env = 'development';
  });

}
