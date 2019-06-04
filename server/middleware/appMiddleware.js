var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
// setup global middleware here

module.exports = function(app) {
  app.use(morgan());
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));


//app.use(multer({ dest: './uploads/'}))
};
