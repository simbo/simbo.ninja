
// get settings
var settings = require('../settings.json');

// require packages
var _       = require('lodash'),
    express = require('express')(),
    nano    = require('nano'),
    moment  = require('moment');

// setup couchdb
var couch = nano({
                url: 'http://' + settings.db.user + ':' + settings.db.password + '@localhost:5984',
                db: 'ninja',
                log: function(id, args) {
                    // console.log(id, args);
                }
            });

// check if database exists, create if necessary
couch.db.list(function(err, body) {
    var dbName = couch.config.db;
    if (body.indexOf(dbName)===-1) {
        couch.db.create(dbName, function(err, body) {
            if (err) throw err;
        });
    }
});

express.get('/', function (req, res) {
    res.send('Hello Node!!!');
});

var server = express.listen(52323, function () {
    console.log('app server listening on port %s', server.address().port);
});
