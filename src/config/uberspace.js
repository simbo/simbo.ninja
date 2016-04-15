'use strict';

const path = require('path');

const uberspace = {
  host: 'libra.uberspace.de',
  user: 'simbo',
  paths: {
    home: '/home/simbo',
    root: '/var/www/virtual/simbo/nginx/simbo.ninja'
  }
};

uberspace.paths.nginx = path.join(uberspace.paths.home, 'nginx/conf');

uberspace.paths.config = {
  src: path.join(uberspace.paths.home, 'simbo.ninja/src/config'),
  dest: path.join(uberspace.paths.root, 'src/config')
};

module.exports = uberspace;
