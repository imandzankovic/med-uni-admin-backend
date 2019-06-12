var morgan = require('morgan')
var bodyParser = require('body-parser')
var cors = require('cors')
var busboy = require('connect-busboy')
var fileupload = require("express-fileupload");

// setup global middleware here

module.exports = function(app) {
  app.use(morgan());
  app.use(fileupload());
  app.use(cors());
  app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  }));
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));



};
