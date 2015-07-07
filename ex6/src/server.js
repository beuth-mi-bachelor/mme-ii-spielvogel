var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    Book = require('./models/book'),
    Author = require('./models/author');


var notFound = {
    type: "notFound",
    statusCode: 404,
    msg: "Requested resource not found"
};

var badRequest = {
    type: "badRequest",
    statusCode: 400,
    msg: "Parameters were wrong"
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
var adminRoute = express.Router();

router.get('/', function (req, res) {
    "use strict";
    res.json({message: 'hello world'});
});

router.route('/books')
    .post(function (req, res) {
        "use strict";

        var authors = [];

        if (typeof req.body.author === "string") {
            var author = new Author();
            author.name = req.body.author;
            authors.push(author);
        } else if (typeof req.body.author === "object") {
            for (var singleAuthor in req.body.author) {
                if (req.body.author.hasOwnProperty(singleAuthor)) {
                    var currentAuthor = req.body.author[singleAuthor];
                    var newAuthor = new Author();
                    newAuthor.name = currentAuthor;
                    authors.push(newAuthor);
                }
            }
        }

        var book = new Book();

        if (authors.length > 0) {
            book.author = authors;
        }

        book.name = req.body.name;
        book.description = req.body.description;
        book.ISBN = req.body.ISBN;
        book.state = req.body.state;

        book.validate(function (err) {
            if (err) {
                res.statusCode = 400;
                return res.json(badRequest);
            } else {
                book.save(function (err) {
                    if (err) {
                        res.statusCode = 400;
                        return res.json(badRequest);
                    }
                    res.statusCode = 201;
                    res.json(book);
                });
            }
        });

    })
    .get(function (req, res) {
        "use strict";

        var paginate = req.query.rpp || 20;
        var page = req.query.page || 1;

        delete req.query.rpp;
        delete req.query.page;

        Book.find(req.query)
            .skip((page-1)*paginate)
            .limit(paginate)
            .exec(function (err, books) {
                if (err) {
                    res.statusCode = 400;
                    return res.json(badRequest);
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
                return res.json(notFound);
            }
            if (book === null) {
                res.statusCode = 404;
                return res.json(notFound);
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
                return res.json(notFound);
            }

            var authors = [];

            if (typeof req.body.author === "string") {
                var author = new Author();
                author.name = req.body.author;
                authors.push(author);
            } else if (typeof req.body.author === "object") {
                for (var singleAuthor in req.body.author) {
                    if (req.body.author.hasOwnProperty(singleAuthor)) {
                        var currentAuthor = req.body.author[singleAuthor];
                        var newAuthor = new Author();
                        newAuthor.name = currentAuthor;
                        authors.push(newAuthor);
                    }
                }
            }

            if (authors.length > 0) {
                book.author = authors;
            }

            book.name = req.body.name;
            book.description = req.body.description;
            book.ISBN = req.body.ISBN;
            book.state = req.body.state;

            book.validate(function (err) {
                if (err) {
                    res.statusCode = 400;
                    return res.json(badRequest);
                } else {
                    book.save(function (err) {
                        if (err) {
                            res.statusCode = 400;
                            return res.json(badRequest);
                        }
                        res.statusCode = 201;
                        res.json(book);
                    });
                }
            });

        });
    })
    .delete(function (req, res) {
        "use strict";

        Book.findById(req.params.book_id, function (err, book) {
            if (err) {
                res.statusCode = 404;
                return res.json(notFound);
            }
            if (book === null) {
                res.statusCode = 404;
                return res.json(notFound);
            }
            book.remove(function (err) {
                if (err) {
                    res.statusCode = 400;
                    return res.json(badRequest);
                }
                res.statusCode = 204;
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
adminRoute.use(express.static(__dirname + '/admin'));

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
    res.sendFile(__dirname + req.params[0]);
});

app.use('/docs', docRoute);
app.use('/api', router);
app.use('/public', routing);
app.use('/admin', adminRoute);

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});