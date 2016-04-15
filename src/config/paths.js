'use strict';

const path = require('path');

const paths = {};

// base folders
paths.cwd = path.dirname(path.dirname(__dirname));
paths.src = path.join(paths.cwd, 'src');
paths.dest = path.join(paths.cwd, 'dest');

// data folders, mapped to objects
paths.config = path.join(paths.src, 'config');
paths.data = path.join(paths.src, 'data');

// node app
paths.app = path.join(paths.src, 'app');
paths.views = path.join(paths.app, 'views');

// site contains everything to generate static content, assets and app views
paths.site = {
  src: path.join(paths.src, 'site'),
  dest: path.join(paths.dest, 'www')
};
paths.content = path.join(paths.site.src, 'content');
paths.layouts = path.join(paths.site.src, 'layouts');
paths.static = path.join(paths.site.src, 'static');

// assets root path
paths.assets = {
  src: path.join(paths.src, 'assets'),
  dest: path.join(paths.site.dest, 'assets')
};
// javascript
paths.js = {
  src: path.join(paths.assets.src, 'js'),
  dest: path.join(paths.assets.dest, 'js')
};
// stylesheets
paths.css = {
  src: path.join(paths.assets.src, 'stylus'),
  dest: path.join(paths.assets.dest, 'css')
};

// nginx config paths to generate production version
paths.nginx = {
  src: path.join(paths.cwd, '.provision/files/etc/nginx'),
  dest: path.join(paths.dest, 'nginx')
};

// remote production paths
paths.remote = require('./uberspace').paths;

module.exports = paths;
