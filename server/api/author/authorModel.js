var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    profesion: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    bio: {
        type: String,
        required: true,


    }
});

module.exports = mongoose.model('author', AuthorSchema)


