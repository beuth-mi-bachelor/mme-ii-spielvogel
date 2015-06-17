var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookScheema = new Schema({
    name: String,
    release: Date,
    updated: { type: Date, default: Date.now },
    author: String,
    publisher: String,
    language: String
});

module.exports = mongoose.model('Books', BookScheema);