var frisby = require('frisby'),
    PORT = 1337;

var testItem = {
    name: "testName",
    publisher: "testPublisher",
    author: "testAuthor",
    language: "de",
    release: new Date(12234554)
};

var testItem2 = {
    name: "testName2",
    publisher: "testPublisher2",
    author: "testAuthor2",
    language: "de",
    release: new Date(1223455434)
};


frisby.create('Start Server')
    .get('http://localhost:'+PORT+'/api')
    .expectStatus(200)
    .toss();

frisby.create('Add Book')
    .post('http://localhost:'+PORT+'/api/books', testItem)
    .expectJSONTypes({
        name: String,
        publisher: String,
        author: String,
        language: String,
        release: String,
        _id: String
    })
    .afterJSON(function(book) {
        "use strict";

        frisby.create('Read Books')
            .get('http://localhost:'+PORT+'/api/books')
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .toss();

        frisby.create('Read Book ' + book._id)
            .get('http://localhost:'+PORT+'/api/books/' + book._id)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({
                name: testItem.name,
                publisher: testItem.publisher,
                author: testItem.author,
                language: testItem.language,
                release: function(val) {
                    var releaseDate = new Date(val);
                    expect(releaseDate).toEqual(jasmine.any(Date));
                    expect(releaseDate).toEqual(testItem.release);
                },
                updated: function(val) {
                    var updateDate = new Date(val);
                    expect(updateDate).toBeLessThan(new Date());
                }
            })
            .toss();

        var oldBook = book;

        frisby.create('Update Book ' + book._id)
            .put('http://localhost:'+PORT+'/api/books/' + book._id, testItem2)
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .afterJSON(function(updateBook) {
                frisby.create('Read Book ' + updateBook._id)
                    .get('http://localhost:'+PORT+'/api/books/' + updateBook._id)
                    .expectStatus(200)
                    .expectHeaderContains('content-type', 'application/json')
                    .expectJSON({
                        name: testItem2.name,
                        publisher: testItem2.publisher,
                        author: testItem2.author,
                        language: testItem2.language,
                        release: function(val) {
                            var releaseDate = new Date(val);
                            expect(releaseDate).toEqual(jasmine.any(Date));
                            expect(releaseDate).toEqual(testItem2.release);
                        },
                        updated: function(val) {
                            var updateDate = new Date(val);
                            expect(updateDate).toBeLessThan(new Date());
                            expect(updateDate).toBeGreaterThan(new Date(oldBook.updated));

                        }
                    })
                    .afterJSON(function(val) {
                        frisby.create('Delete Book ' + val._id)
                            .delete('http://localhost:'+PORT+'/api/books/' + val._id)
                            .expectStatus(200)
                            .expectHeaderContains('content-type', 'application/json')
                            .afterJSON(function(deletedItem) {
                                frisby.create('Read Book ' + deletedItem.itemId)
                                    .get('http://localhost:'+PORT+'/api/books/' + deletedItem.itemId)
                                    .expectStatus(200)
                                    .expectHeaderContains('content-type', 'application/json')
                                    .expectJSON({
                                        statusCode: 404
                                    })
                                    .toss();
                            })
                            .toss();
                    })
                    .toss();
            })
            .toss();

    })
    .toss();