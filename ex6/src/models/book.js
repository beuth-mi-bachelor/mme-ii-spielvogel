var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookScheema = new Schema({
    name: {
        type: String,
        required: true,
        match: /[A-Z][-a-zA-Z\s]+/,
        minLength: 2,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    ISBN: {
        type: String,
        match: /[0-9][-0-9\s]+/,
        minLength: 10,
        maxLength: 17,
        required: true,
        trim: true
    },
    state: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('Books', BookScheema);