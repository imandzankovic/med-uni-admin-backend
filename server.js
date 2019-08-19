var express = require('express');
var app = express();
var api = require('./server/api/api');
//var config = require('./server/config/config');
var mongoose = require('mongoose');
// var upload = require('express-fileupload');
// var ResumableUpload = require('node-youtube-resumable-upload');
// var googleauth = require('google-auth-cli');
// var google = require('googleapis');
// let naslov=''




//require('mongoose').connect(config.db.url);



require('./server/middleware/appMiddleware')(app);

app.use('/api', api);




//app.listen(config.port)
//console.log("Server Started at port 3000");



app.listen(process.env.PORT || 3000)


mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('Connected to Mongo - MedUni');
        else {
            console.log(err)
        }
});



// mongoose.connect('mongodb+srv://imandz:iman@meduni-vneye.mongodb.net/medUniAdmin?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
//     if (!err)
//         console.log('Connected to Mongo - MedUniAdmin');
//         else {
//             console.log(err)
//         }
// })

// mongoose.connect('mongodb+srv://imandz:iman@meduni-vneye.mongodb.net/medUni?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
//     if (!err)
//         console.log('Connected to Mongo - MedUni');
//         else {
//             console.log(err)
//         }
// })

//app.listen(3000)