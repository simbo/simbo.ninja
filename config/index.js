'use strict';

var path = require('path');

var ReqMapper = require('requirements-mapper');

var configMapper = new ReqMapper('./');
configMapper.globOptions.ignore = path.basename(__filename);

module.exports = configMapper.map();
