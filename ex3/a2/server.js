var express = require('express'),
    fs = require('fs');

var app = express();

var args = process.argv.slice(2),
    port = parseInt(args[0], 10) || 1337,
    pubDirName = "public";

app.use(express.static(__dirname + '/' + pubDirName));

app.get(/^(.+)$/, function(req, res){
    "use strict";
    res.sendFile(__dirname + req.params[0], function(err, result) {
        var html = "<ul>";
        if (err.status === 404) {
            fs.readdir(__dirname + "/" + pubDirName + req.params[0], function (err, files) {
                if (err) {
                    console.error(err);
                    res.end();
                }

                files.forEach(function (file) {
                    html += "<li>" + file + "</li>";
                });

                html += "</ul>";
                res.send(html);
            });
        }
    });
});

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});