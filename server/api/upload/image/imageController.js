const { Storage } = require('@google-cloud/storage');
let uploadimage = '';
let imgName = '';


imageUpload = function (req, res, next) {
  if (req.files.upfile) {
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    imgName = name;
    let uploadpath = __dirname + '/images/' + name;
    uploadimage = uploadpath
    file.mv(uploadpath, function (err) {
      if (err) {
        console.log("File Upload Failed", name, err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded", name);
        res.send('Done! Uploading files')
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
}

uploadToGoogle = function (req, res) {

  const GOOGLE_CLOUD_PROJECT_ID = '110088265970817095216'; // Replace with your project ID
  const GOOGLE_CLOUD_KEYFILE = `${__dirname}/keyfile.json`; // Replace with the path to the downloaded private key

  const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });

  var BUCKET_NAME = 'staging.meduni.appspot.com'
  var myBucket = storage.bucket(BUCKET_NAME)

  var file = myBucket.file(imgName)
 
  // upload file to bucket
  let localFileLocation = uploadimage
 
  myBucket.upload(localFileLocation, { public: true })
    .then(file => {
      // file saved
    })

  return res.status(200).send({
    message: `https://storage.googleapis.com/${BUCKET_NAME}/${imgName}`
  });
}

exports.post = function (req, res, next) {
  imageUpload(req,res,next);

};

exports.get = function (req, res, next) {
  uploadToGoogle(req, res)
  res.send(200)
};