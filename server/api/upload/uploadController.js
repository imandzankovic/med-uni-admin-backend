const Youtube = require("youtube-api")
    , fstream = require("fs")
    , readJson = require("r-json")
    , Lien = require("lien")
    , Logger = require("bug-killer")
    , opn = require("opn")
    , prettyBytes = require("pretty-bytes")
    , path = require('path')
    , fs = require('fs-extra')
    ;

const CREDENTIALS = readJson(`${__dirname}/credentials.json`);

let uploadPath = __dirname + '/uploads/';

fs.ensureDir(uploadPath);
let title, description = ''

busboy = function (req, res) {
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
        title = filename
        Logger.log(`Upload of '${filename}' started`);
        
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

exports.post = function (req, res, next) {
    busboy(req, res);
};

exports.get = function (req, res, next) {


    generateAuth();
    handleOauthCallback(initLien(), req);
    res.status(200).send('Uploading to YT');
    Logger.log("Uploading to YT");


};