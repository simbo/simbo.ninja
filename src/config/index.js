'use strict';

const path = require('path');

const ReqMapper = require('requirements-mapper');

const configMapper = new ReqMapper('./');
configMapper.globOptions.ignore = path.basename(__filename);

module.exports = configMapper.map();
