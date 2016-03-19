'use strict';

var path = require('path');

var uberspace = {
  host: 'libra.uberspace.de',
  user: 'simbo',
  paths: {
    home: '/home/simbo',
    root: '/var/www/virtual/simbo/nginx/simbo.ninja'
  }
};

uberspace.paths.nginx = path.join(uberspace.paths.home, 'nginx/conf');
uberspace.paths.www = path.join(uberspace.paths.root, 'www');
uberspace.paths.app = path.join(uberspace.paths.root, 'app');
uberspace.paths.config = {
  src: path.join(uberspace.paths.home, 'simbo.ninja/config'),
  dest: path.join(uberspace.paths.root, 'config')
};

module.exports = uberspace;
