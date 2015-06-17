var frisby = require('frisby'),
    PORT = 1337;

var testItem = {
    name: "first testName",
    description: "first description test foo bar",
    ISBN: "1234-5678-9123-123",
    state: 1
};

var testItem2 = {
    name: "second testName",
    description: "second description test foo bar",
    ISBN: "2345-6789-1234-1234",
    state: 2
};

frisby.create('Start Server')
    .get('http://localhost:' + PORT + '/api')
    .expectStatus(200)
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