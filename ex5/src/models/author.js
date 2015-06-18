var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuthorScheema = new Schema({
    name: {
        type: String,
        required: true,
        match: /[A-Z][-a-zA-Z\s]+/,
        trim: true
    }
});

module.exports = mongoose.model('Author', AuthorScheema);