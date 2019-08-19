var express = require('express');
var app = express();
var api = require('./server/api/api');
var mongoose=require('mongoose');
cors = require('cors');
app.use(cors());

//var config = require('./config/config');

require('./server/middleware/appMiddleware')(app);
app.use('/api', api);
app.listen(process.env.PORT || 3000)


mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('Connected to Mongo - MedUni');
        else {
            console.log(err)
        }
});

/*mongoose.connect('mongodb://imand:iman.123@ds211168.mlab.com:11168/heroku_v65lvc52', { useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('Connected to Mongo - MedUni');
        else {
            console.log(err)
        }
})
*/




