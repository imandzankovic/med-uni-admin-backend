var express = require('express');
var app = express();
var api = require('./server/api/api');
var mongoose=require('mongoose');
cors = require('cors');
app.use(cors());

//var config = require('./config/config');

require('./server/middleware/appMiddleware')(app);
app.use('/api', api);
app.listen(3000)

mongoose.connect('mongodb+srv://imandz:iman@meduni-vneye.mongodb.net/medUniAdmin?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('Connected to Mongo - MedUniAdmin');
        else {
            console.log(err)
        }
})


