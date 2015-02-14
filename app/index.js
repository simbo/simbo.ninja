
var app = require('express')();

app.get('/', function (req, res) {
    res.send('Hello Node!!!');
});

var server = app.listen(52323, function () {
    console.log('app server listening on port %s', server.address().port);
});
