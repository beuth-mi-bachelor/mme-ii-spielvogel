var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookScheema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    ISBN: {
        type: String,
        required: true
    },
    state: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('Books', BookScheema);