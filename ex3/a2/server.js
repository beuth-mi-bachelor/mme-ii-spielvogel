var express = require('express');
var app = express();

var ip = '127.0.0.1';
var port = 1337;

app.get(/^(.+)$/, function(req, res){
    "use strict";
    console.log('static file request : ' + req.params[0]);
    res.sendFile( __dirname + req.params[0]);
});

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://%s:%s', ip, port);
});