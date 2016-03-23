'use strict';

var path = require('path');

var ReqMapper = require('requirements-mapper');

var setupMapper = new ReqMapper('./');
setupMapper.globOptions.ignore = path.basename(__filename);

module.exports = setupMapper.map();
