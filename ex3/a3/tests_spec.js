var frisby = require('frisby'),
    PORT = 1337;;

frisby.create('Start Server')
    .get('http://localhost:'+PORT+'/hello')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('Hello World!')
    .toss();
