var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AboutSchema = new Schema({
    name: {
        type: String
    },

    title: {
        type: String
    },
    description: {
        type: String
    },
    img: {
        type: String,

    }
});

module.exports = mongoose.model('about', AboutSchema)


