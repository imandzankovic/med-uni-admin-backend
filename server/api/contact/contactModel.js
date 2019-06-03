var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ContactSchema=new Schema({
    name:{
        type:String      
    },

    email:{
        type:String
    },
    phone:{
        type:Number
    },
    msg:{
        type:String,
    
    }
});

module.exports=mongoose.model('contact',ContactSchema)


