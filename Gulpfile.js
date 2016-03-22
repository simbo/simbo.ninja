'use strict';

// module requires
var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    gulpplug = require('gulpplug'),
    ReqMapper = require('requirements-mapper');

// get config
var config = require('./src/config'),
    envSetup = require('./.gulp/modules/env-setup.js');

// initialize gulpplug
var plug = new gulpplug.Plug(gulp, {tasksDir: '.gulp/tasks'});

// apply config properties to plug instance
Object.keys(config).forEach(function(prop) {
  if (!plug.hasOwnProperty(prop)) plug[prop] = config[prop];
});

// initialize a requirements mapper for the data folder
plug.data = new ReqMapper(plug.paths.data);

// setup environment
envSetup(plug);

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
  .addSequence('release:nginx', [
    'clean:nginx-conf',
    'build:nginx-conf',
    'uberspace:rsync-nginx-conf',
    'uberspace:reload-nginx'
  ])
  .addSequence('release:www', [
    'env:prod',
    'build',
    'uberspace:rsync-www'
  ])
  .addSequence('release:app', [
    'uberspace:rsync-app',
    'uberspace:after-rsync-app'
  ])
  .addSequence('release', [
    ['release:www', 'release:app']
  ]);
