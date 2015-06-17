var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    Book = require('./models/book');

var error = {
    type: "error",
    statusCode: 404,
    msg: "Requested resource not found"
};

var pubDirName = "public";

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mme-ii');

var args = process.argv.slice(2),
    port = parseInt(args[0], 10) || 1337;

var router = express.Router();
var routing = express.Router();
var docRoute = express.Router();


router.get('/', function (req, res) {
    "use strict";
    res.json({message: 'hello world'});
});

router.route('/books')
    .post(function (req, res) {
        "use strict";
        var book = new Book();

        book.name = req.body.name;
        book.release = req.body.release;
        book.publisher = req.body.publisher;
        book.language = req.body.language;
        book.author = req.body.author;
        book.updated = new Date();

        book.save(function (err) {
            if (err) {
                res.statusCode = 400;
                return res.json(error);
            }
            res.statusCode = 200;
            res.json(book);
        });
    })
    .get(function (req, res) {
        "use strict";
        Book.find(function (err, books) {
            if (err) {
                res.statusCode = 400;
                return res.json(error);
            }
            res.statusCode = 200;
            res.json(books);
        });
    });

router.route('/books/:book_id')
    .get(function (req, res) {
        "use strict";
        Book.findById(req.params.book_id, function (err, book) {
            if (err) {
                res.statusCode = 404;
                return res.json(error);
            }
            if (book === null) {
                res.statusCode = 404;
                return res.json(error);
            }
            res.statusCode = 200;
            res.json(book);
        });
    })
    .put(function (req, res) {
        "use strict";
        Book.findById(req.params.book_id, function (err, book) {

            if (err) {
                res.statusCode = 404;
                return res.json(error);
            }

            book.name = req.body.name;
            book.release = req.body.release;
            book.publisher = req.body.publisher;
            book.language = req.body.language;
            book.author = req.body.author;
            book.updated = new Date();

            book.save(function (err) {
                if (err) {
                    res.statusCode = 400;
                    return res.json(error);
                }
                res.statusCode = 200;
                res.json(book);
            });

        });
    })
    .delete(function (req, res) {
        "use strict";

        Book.findById(req.params.book_id, function (err, book) {
            if (err) {
                res.statusCode = 404;
                return res.json(error);
            }
            if (book === null) {
                res.statusCode = 404;
                return res.json(error);
            }
            book.remove(function (err) {
                if (err) {
                    res.statusCode = 400;
                    return res.json(error);
                }
                res.statusCode = 200;
                res.json({
                    message: "deleted book",
                    deleted: true,
                    itemId: req.params.book_id
                });
            });
        });
    });

routing.use(express.static(__dirname + '/' + pubDirName));
docRoute.use(express.static(__dirname + '/docs'));

app.get("/hello", function (req, res) {
    "use strict";
    res.send("Hello World!");
});

routing.get(/^(.+)$/, function (req, res) {
    "use strict";
    res.sendFile(__dirname + req.params[0], function (err, result) {
        var html = "<ul>";
        if (err.status === 404) {
            fs.readdir(__dirname + "/" + pubDirName + req.params[0], function (err, files) {
                if (err) {
                    return res.status(404).send('Not found');
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

docRoute.get(/^(.+)$/, function (req, res) {
    "use strict";
    console.log(req.params[0]);
    res.sendFile(__dirname + req.params[0]);
});

app.use('/docs', docRoute);
app.use('/api', router);
app.use('/public', routing);

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});