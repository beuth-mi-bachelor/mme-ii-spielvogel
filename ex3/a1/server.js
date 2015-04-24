var express = require('express');
var app = express();

var ip = '127.0.0.1';
var port = 1337;

app.get('/', function (req, res) {
    "use strict";
    res.send('Hello World!');
});

var server = app.listen(port, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log('server listening at http://%s:%s', host, port);
});