var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var AuthorSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    surname:{
        type:String,
        required:true
    },
    img:{
        type:String,
        //required:true
    },
    bio:{
        type:String,
        required:true,
        unique:true
    
    }
});

module.exports=mongoose.model('author',AuthorSchema)


