var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    required: true,
   // unique: true
  },

  text: {
    type: String,
    required: true
  },
  img: {
    type: String
  },
  video: {
    type: String
  },
  

  author: { type: Schema.Types.ObjectId, ref: 'author' },
  
  //author: {type: Schema.Types.ObjectId, ref: 'user'},
  categories: [{ type: Schema.Types.ObjectId, ref: 'category' }]
});

module.exports = mongoose.model('post', PostSchema)