var express = require('express'),
    fs = require('fs');

var app = express();

var args = process.argv.slice(2),
    port = parseInt(args[0], 10) || 1337;

app.use(express.static(__dirname + '/public'));

app.get(/^(.+)$/, function(req, res){
    "use strict";
    console.log(req);
    res.sendFile(__dirname + req.params[0]);
});

function getDirectories(path) {
    "use strict";
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});