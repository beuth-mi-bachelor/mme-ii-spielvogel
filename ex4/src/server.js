var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    Book = require('./models/book');

var error = {
    type: "error",
    statusCode : 404,
    msg: "Requested resource not found"
};

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

router.route('/books')
    .post(function(req, res) {
        "use strict";
        var book = new Book();

        book.name = req.body.name;
        book.release = req.body.release;
        book.publisher = req.body.publisher;
        book.language = req.body.language;
        book.author = req.body.author;
        book.updated = new Date();

        book.save(function(err) {
            if (err) {
                return res.json(error);
            }
            res.json({
                message: "created book",
                item: book
            });
        });
    })
    .get(function(req, res) {
        "use strict";
        Book.find(function(err, books) {
            if (err) {
                return res.json(error);
            }
            res.json(books);
        });
    });

router.route('/books/:book_id')
    .get(function(req, res) {
        "use strict";
        Book.findById(req.params.book_id, function(err, book) {
            if (err) {
                return res.json(error);
            }
            if (book === null) {
                return res.json(error);
            }
            res.json({
                message: "found book",
                item: book
            });
        });
    })
    .put(function(req, res) {
        "use strict";
        Book.findById(req.params.book_id, function(err, book) {

            if (err) {
                return res.json(error);
            }

            book.name = req.body.name;
            book.release = req.body.release;
            book.publisher = req.body.publisher;
            book.language = req.body.language;
            book.author = req.body.author;
            book.updated = new Date();

            book.save(function(err) {
                if (err) {
                    return res.json(error);
                }
                res.json({
                    message: "updated book",
                    item: book
                });
            });

        });
    })
    .delete(function(req, res) {
        "use strict";
        Book.remove({
            _id: req.params.book_id
        }, function(err, book) {
            if (err) {
                res.json(error);
            }
            res.json({
                message: "deleted book",
                deleted: true,
                itemId:  req.params.book_id
            });
        });
    });


app.use('/api', router);

var server = app.listen(port, function () {
    "use strict";
    var port = server.address().port;
    console.log('server listening at http://localhost:%s', port);
});