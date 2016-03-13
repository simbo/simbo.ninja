'use strict';

// module requires
var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    gulpplug = require('gulpplug'),
    ReqMapper = require('requirements-mapper');

// get config
var config = require('./config');

// initialize gulpplug
var plug = new gulpplug.Plug(gulp, {tasksDir: '.gulp/tasks'});

// apply config properties to plug instance
Object.keys(config).forEach(function(prop) {
  if (!plug.hasOwnProperty(prop)) plug[prop] = config[prop];
});

// initialize a requirements mapper for the data folder
plug.data = new ReqMapper(plug.paths.data);

// setter/getter for environment
Object.defineProperty(plug, 'env', {
  get: function() { return process.env.NODE_ENV; },
  set: function(val) {
    if (['production', 'development'].indexOf(val) !== -1) {
      process.env.NODE_ENV = val;
      plug.util.log('Environment: ' + plug.util.colors.yellow(plug.env));
    }
  }
});
plug.env = process.env.NODE_ENV;

// global browsersync instance
plug.browserSync = browserSync;
plug.reload = browserSync.reload;

// gulpplugging...
plug
  .loadPlugins()
  .addTasks()
  .addHelpTask()

  // add task sequences
  .addSequence('build', [
    ['clean'],
    ['copy', 'build:css', 'build:js', 'build:site']
  ])
  .addSequence('dev', [
    'build',
    ['browsersync', 'watch']
  ])
  .addSequence('copy', [
    ['copy:img', 'copy:files']
  ])
  .addSequence('release', [
    'env:prod',
    'build',
    'uberspace:rsync-www'
  ])
  .addSequence('nginx-conf', [
    'clean:nginx-conf',
    'build:nginx-conf',
    'uberspace:rsync-nginx-conf',
    'uberspace:restart-nginx'
  ]);
