'use strict';

var express = require('express'),
    Q = require('q');

var setup = require('app/modules/setup');

Q(express())
  .then(setup.views)
  .then(setup.routes)
  .then(setup.errorhandling)
  .done(setup.server);
