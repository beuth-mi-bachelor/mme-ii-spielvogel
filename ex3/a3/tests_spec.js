var frisby = require('frisby');

frisby.create('Start Server')
    .get('http://localhost:8080/hello')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('Hello World!')
    .toss();