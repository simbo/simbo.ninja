'use strict';

var path = require('path');

var uberspace = require('./uberspace');

var paths = {};

paths.cwd = path.dirname(__dirname);

paths.src = path.join(paths.cwd, 'src');

paths.app = path.join(paths.cwd, 'app');
paths.config = path.join(paths.cwd, 'config');

paths.dest = path.join(paths.cwd, 'dest');

paths.data = path.join(paths.src, 'data');

paths.site = {
  src: path.join(paths.src, 'site'),
  dest: path.join(paths.dest, 'www')
};
paths.content = path.join(paths.site.src, 'content');
paths.layouts = path.join(paths.site.src, 'layouts');
paths.static = path.join(paths.site.src, 'static');
paths.views = path.join(paths.site.src, 'views');

paths.assets = {
  src: path.join(paths.src, 'assets'),
  dest: path.join(paths.site.dest, 'assets')
};

paths.js = {
  src: path.join(paths.assets.src, 'js'),
  dest: path.join(paths.assets.dest, 'js')
};

paths.css = {
  src: path.join(paths.assets.src, 'stylus'),
  dest: path.join(paths.assets.dest, 'css')
};

paths.nginx = {
  src: path.join(paths.cwd, '.provision/files/etc/nginx'),
  dest: path.join(paths.dest, 'nginx')
};

paths.remote = uberspace.paths;

module.exports = paths;
