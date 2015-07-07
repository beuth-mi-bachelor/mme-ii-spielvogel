var frisby = require('frisby'),
    PORT = 1337;

var testItem = {
    name: "first testName",
    author: ["Albert"],
    description: "first description test foo bar",
    ISBN: "978 0 596 52068 7",
    state: 1
};

var testItem2 = {
    name: "second testName",
    author: ["Albert", "Peter"],
    description: "second description test foo bar",
    ISBN: "9780596520687",
    state: 2
};

frisby.create('Start Server')
    .get('http://localhost:' + PORT + '/api')
    .expectStatus(200)
    .toss();

frisby.create('Test Pagination')
    .get('http://localhost:' + PORT + '/api/books?page=1&rpp=2')
    .expectStatus(200)
    .expectJSONLength(2)
    .toss();

frisby.create('Test Pagination')
    .get('http://localhost:' + PORT + '/api/books?page=2&rpp=5')
    .expectStatus(200)
    .expectJSONLength(5)
    .toss();

frisby.create('Add Book')
    .post('http://localhost:' + PORT + '/api/books', testItem)
    .expectStatus(201)
    .expectJSONTypes({
        name: String,
        description: String,
        ISBN: String,
        state: Number
    })
    .afterJSON(function (book) {
        "use strict";

        frisby.create('Read Books')
            .get('http://localhost:' + PORT + '/api/books')
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .toss();

        frisby.create('Read Book ' + book._id)
            .get('http://localhost:' + PORT + '/api/books/' + book._id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({
                name: testItem.name,
                description: testItem.description,
                ISBN: testItem.ISBN,
                state: testItem.state
            })
            .toss();

        var oldBook = book;

        frisby.create('Update Book ' + book._id)
            .put('http://localhost:' + PORT + '/api/books/' + book._id, testItem2)
            .expectStatus(201)
            .expectHeaderContains('content-type', 'application/json')
            .afterJSON(function (updateBook) {
                frisby.create('Read Book ' + updateBook._id)
                    .get('http://localhost:' + PORT + '/api/books/' + updateBook._id)
                    .expectStatus(200)
                    .expectHeaderContains('content-type', 'application/json')
                    .expectJSON({
                        name: testItem2.name,
                        description: testItem2.description,
                        ISBN: testItem2.ISBN,
                        state: testItem2.state
                    })
                    .afterJSON(function (val) {
                        frisby.create('Delete Book ' + val._id)
                            .delete('http://localhost:' + PORT + '/api/books/' + val._id)
                            .expectStatus(204)
                            .toss();
                    })
                    .toss();

            })
            .toss();

    })
    .toss();

// testing 404
frisby.create('Not found Book with id abcd')
    .get('http://localhost:' + PORT + '/api/books/abcd')
    .expectStatus(404)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        statusCode: 404
    })
    .toss();

var failItem1 = {
    "author": ["Albert"],
    "name": "Max Mustermann"
};
var failItem2 = {
    "author": ["Albert"],
    "ISBN": "1-56389-668-0"
};

var failItem3 = {
    "author": ["Albert"],
    "name": "Max Mustermann",
    "ISBN": "1 223 232 121 121",
    "state": "abc"
};

// testing 400
frisby.create('Add data when missing ISBN')
    .post('http://localhost:' + PORT + '/api/books', failItem1)
    .expectStatus(400)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        statusCode: 400
    })
    .toss();

frisby.create('Add data when missing name')
    .post('http://localhost:' + PORT + '/api/books', failItem2)
    .expectStatus(400)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        statusCode: 400
    })
    .toss();

frisby.create('Add data when wrong state')
    .post('http://localhost:' + PORT + '/api/books', failItem3)
    .expectStatus(400)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        statusCode: 400
    })
    .toss();