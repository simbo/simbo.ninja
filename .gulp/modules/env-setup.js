'use strict';

const environments = ['production', 'development'];

let env;

module.exports = envStatus;

function envStatus(plug) {

  // setter/getter for environment
  Reflect.defineProperty(plug, 'env', {
    get() {
      return env;
    },
    set(val) {
      if (environments.indexOf(val) !== -1) {
        env = val;
        plug.util.log(`Environment: ${plug.util.colors.yellow(plug.env)}`);
      }
    }
  });

  plug.env = process.env.NODE_ENV;

  // add plain gulp task to set env to prod
  plug.gulp.task('env:prod', () => {
    plug.env = 'production';
  });

  // add plain gulp task to set env to dev
  plug.gulp.task('env:dev', () => {
    plug.env = 'development';
  });

}
