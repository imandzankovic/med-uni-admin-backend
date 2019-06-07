const Youtube = require("youtube-api")
    , fstream = require("fs")
    , readJson = require("r-json")
    , Lien = require("lien")
    , Logger = require("bug-killer")
    , opn = require("opn")
    , prettyBytes = require("pretty-bytes")
    , path = require('path')
    , fs = require('fs-extra')
    ,promise = require('bluebird');
    ;

const CREDENTIALS = readJson(`${__dirname}/credentials.json`);

let uploadPath = __dirname + '/uploads/';
let uploadimage=''
let imgName=''
fs.ensureDir(uploadPath);
let title, description = ''

busboy = function (req, res) {
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
        title = filename
        Logger.log(`Upload of '${filename}' started`);
        
        //set to videos
        uploadPath+='videos/'
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream)

        res.send('Done Uploading files!')

        fstream.on('close', () => {
            Logger.log(`Upload of '${filename}' finished`);
        });

        fstream.on('error', function (err) {
            if (err) {
                res.end(err);
            }

        });
    })
}

imageUpload=function(req,res,next){
    console.log(req.files);
    if(req.files.upfile){
      var file = req.files.upfile,
        name = file.name,
        type = file.mimetype;
        imgName=name;
      let uploadpath = __dirname + '/uploads' + '/images/' + name;
      uploadimage=uploadpath
      file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.send("Error Occured!")
        }
        else {
          console.log("File Uploaded",name);        
         res.send('Done! Uploading files')
        }
      });
    }
    else {
      res.send("No File selected !");
      res.end();
    };
}

uploadToGoogle=function(req,res){

    const {Storage} = require('@google-cloud/storage');
  
    const GOOGLE_CLOUD_PROJECT_ID = '110088265970817095216'; // Replace with your project ID
    const GOOGLE_CLOUD_KEYFILE = `${__dirname}/keyfile.json`; // Replace with the path to the downloaded private key
    
    
    const storage =new Storage({
      projectId: GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: GOOGLE_CLOUD_KEYFILE,
    });


var BUCKET_NAME = 'staging.meduni.appspot.com'
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket
var myBucket = storage.bucket(BUCKET_NAME)

// check if a file exists in bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/file?method=exists
var file = myBucket.file(imgName)
//var file = myBucket.file('2.jpg')
// file.existsAsync()
//   .then(exists => {
//     if (exists) {
//       // file exists in bucket
//     }
//   })
//   .catch(err => {
//      return err
//   })
    
    
// upload file to bucket
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/0.39.0/storage/bucket?method=upload
let localFileLocation = uploadimage
//let localFileLocation= __dirname + '/uploads/images/2.jpg';
// bucket.upload("1.jpg", (err, file) => {
//     if (err) { return console.error(err); }
//     let publicUrl = `https://firebasestorage.googleapis.com/v0/b/${PROJECT_ID}.appspot.com/o/${file.metadata.name}?alt=media`;
//     console.log(publicUrl);
// });


myBucket.upload(localFileLocation, { public: true })
  .then(file => {
    // file saved
  })
    
// get public url for file
var getPublicThumbnailUrlForItem = file_name => {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${file_name}`
}
return res.status(200).send({
    message:  `https://storage.googleapis.com/${BUCKET_NAME}/${imgName}`
  });
}

initLien = function () {
    return server = new Lien({
        host: "localhost"
        , port: 4000
    });
};

authenticate = function () {
    return oauth = Youtube.authenticate({
        type: "oauth"
        , client_id: CREDENTIALS.web.client_id
        , client_secret: CREDENTIALS.web.client_secret
        , redirect_url: CREDENTIALS.web.redirect_uris[0]
    });
};

generateAuth = function () {
    var oauth = authenticate()
    opn(oauth.generateAuthUrl({
        access_type: "offline"
        , scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));
}

insertToYt = function (title, description) {
    uploadPath += title;
    Logger.log('YOUTUBE UPLOAD PATH:' + uploadPath)
    let req = Youtube.videos.insert({
        resource: {
            // Video title and description
            snippet: {
                title: title, description: description
            }
            , status: { privacyStatus: "private" }
        }
        // This is for the callback function
        , part: "snippet,status"

        // Create the readable stream to upload the video
        , media: { body: fstream.createReadStream(uploadPath) }

    }, (err, data) => {
        console.log("Done.");
        process.exit();
        res.status(200).send('Done')

    });
}

handleOauthCallback = function (server, req) {
    server.addPage("/oauth2callback", lien => {
        Logger.log("Trying to get the token using the following code: " + lien.query.code);
        oauth.getToken(lien.query.code, (err, tokens) => {

            if (err) {
                lien.lien(err, 400);
                return Logger.log(err);
            }

            Logger.log("Got the tokens.");

            oauth.setCredentials(tokens);
            insertToYt(title, description);
            setInterval(function () {
                Logger.log(`${prettyBytes(req.connection._bytesDispatched)} bytes uploaded.`);
            }, 250);
            lien.end("The video is being uploaded.");
        });
    });
}

uploadImage=function(name,path){
    var fileMetadata = {
        //'name': 'photo.jpg'
        'name':name
      };
      var media = {
        mimeType: 'image/jpeg',
        //body: fs.createReadStream('files/photo.jpg')
        body: fs.createReadStream(path)
      };
      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log('File Id: ', file.id);
        }
      });
}

exports.post = function (req, res, next) {
   // busboy(req, res);
   imageUpload(req,res,next)
   //res.send('Done! Uploading files')
};

exports.get = function (req, res, next) {
    //imageUpload(req,res,next)
    uploadToGoogle(req,res)
    //res.send(200)

    // generateAuth();
    // handleOauthCallback(initLien(), req);
    // res.status(200).send('Uploading to YT');
    // Logger.log("Uploading to YT");


};