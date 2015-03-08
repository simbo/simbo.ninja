
var _       = require('lodash'),
    express = require('express')(),
    nano    = require('nano')('http://localhost:5984'),
    moment  = require('moment');

express.get('/', function (req, res) {
    res.send('Hello Node!!!');
});

var server = express.listen(52323, function () {
    console.log('express server listening on port %s', server.address().port);
});
