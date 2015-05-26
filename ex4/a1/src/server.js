var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/mme-ii');

var args = process.argv.slice(2),
    port = parseInt(args[0], 10) || 1337;
var router = express.Router();

router.get('/', function(req, res) {
    "use strict";
    res.json({ message: 'hello world' });
});

app.use('/api', router);

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});