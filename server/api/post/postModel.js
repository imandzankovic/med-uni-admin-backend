var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true
  },
  title2: {
    type: String,
  },
  text2: {
    type: String,
  },
  title3: {
    type: String,
  },
  text3: {
    type: String,
  },
  sumUp: {
    type: String
  },
  img: {
    type: String
  },
  video: {
    type: String
  },
  timestamp: {
    type: Number,
    default: Date.now
  },

  author: { type: Schema.Types.ObjectId, ref: 'author' },

 // categories: [{ type: Schema.Types.ObjectId, ref: 'category' }]
});

module.exports = mongoose.model('post', PostSchema)