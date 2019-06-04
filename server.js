var express = require('express');
var app = express();
var api = require('./server/api/api');
var mongoose = require('mongoose');
var upload = require('express-fileupload');
var ResumableUpload = require('node-youtube-resumable-upload');
var googleauth = require('google-auth-cli');
var google = require('googleapis');
let naslov=''

// I downloaded the file from OAuth2 -> Download JSON




require('./server/middleware/appMiddleware')(app);

const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
var cors = require('cors')

let uploadPath = __dirname + '/uploads/';
fs.ensureDir(uploadPath);

app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

app.use(cors())
//var config = require('./config/config');
app.use('/api', api);

// var uploadPath = __dirname + '/uploads/';
// fs.ensureDir(uploadPath);

console.log("Server Started at port 3000");


/**
 * Create route /upload which handles the post request
 */
app.route('/upload').post((req, res, next) => {


  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on('file', (fieldname, file, filename) => {
    naslov=filename
    console.log(`Upload of '${filename}' started`);
    console.log(naslov);

    // Create a write stream of the new file
    console.log(uploadPath)
    const fstream = fs.createWriteStream(path.join(uploadPath, filename));
    // Pipe it trough
    file.pipe(fstream)

  //console.log("File Uploaded",name);
  res.send('Done! Uploading files')

  fstream.on('close', () => {
    console.log(`Upload of '${filename}' finished`);
  });

  fstream.on('error', function (err) {
    if (err) {
      res.end(err);
    }

  });
  });

});


app.route('/yt').get((req, res, next) => {
   uploadPath +=naslov
  const Youtube = require("youtube-api")
  , fs = require("fs")
  , readJson = require("r-json")
  , Lien = require("lien")
  , Logger = require("bug-killer")
  , opn = require("opn")
  , prettyBytes = require("pretty-bytes")
  ;

// I downloaded the file from OAuth2 -> Download JSON
const CREDENTIALS = readJson(`credentials.json`);

// Init lien server
let server = new Lien({
  host: "localhost"
, port: 4000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
  type: "oauth"
, client_id: CREDENTIALS.web.client_id
, client_secret: CREDENTIALS.web.client_secret
, redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
  access_type: "offline"
, scope: ["https://www.googleapis.com/auth/youtube.upload"]
}));

// Handle oauth2 callback
server.addPage("/oauth2callback", lien => {
  Logger.log("Trying to get the token using the following code: " + lien.query.code);
  oauth.getToken(lien.query.code, (err, tokens) => {

      if (err) {
          lien.lien(err, 400);
          return Logger.log(err);
      }

      Logger.log("Got the tokens.");

      oauth.setCredentials(tokens);

      lien.end("The video is being uploaded. Check out the logs in the terminal.");

      var req = Youtube.videos.insert({
          resource: {
              // Video title and description
              snippet: {
                  title: 'ama de'
                , description: "Test video upload via YouTube API"
              }
              // I don't want to spam my subscribers
            , status: {
                  privacyStatus: "private"
              }
          }
          // This is for the callback function
        , part: "snippet,status"

          // Create the readable stream to upload the video
        , media: {
         
              body: fs.createReadStream(uploadPath)
          }
      }, (err, data) => {
          console.log("Done.");
          process.exit();
          res.status(200).send('Done')
        
      });

      setInterval(function () {
          Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
      }, 250);
  });
});
     // console.log("File Uploaded",name);
      res.send('Done! Uploading files')
});












<<<<<<< HEAD
mongoose.connect('mongodb+srv://imandz:iman@meduni-vneye.mongodb.net/medUniAdmin?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
  if (!err)
    console.log('Connected to Mongo - MedUniAdmin');
  else {
    console.log(err)
  }
})

app.listen(3000)


=======
// mongoose.connect('mongodb+srv://imandz:iman@meduni-vneye.mongodb.net/medUniAdmin?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
//     if (!err)
//         console.log('Connected to Mongo - MedUniAdmin');
//         else {
//             console.log(err)
//         }
// })

mongoose.connect('mongodb+srv://imandz:iman@meduni-vneye.mongodb.net/medUni?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('Connected to Mongo - MedUni');
        else {
            console.log(err)
        }
})
>>>>>>> 61ef7955d3e6c928862212a3bb06c8fa96384c6b
