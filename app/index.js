'use strict';

var express = require('express'),
    Q = require('q');

var setup = require('./modules/setup');

Q(express())
  .then(setup.routes)
  .then(setup.errorhandler)
  .done(setup.server);
