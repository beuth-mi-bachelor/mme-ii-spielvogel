var express = require('express');
var app = express();

var args = process.argv.slice(2);

var port = parseInt(args[0], 10) || 1337;

app.get('/', function (req, res) {
    "use strict";
    res.send('Hello World!');
});

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});