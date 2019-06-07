exports.post = function (req, res, next) {
    console.log(req.files);
    if(req.files.upfile){
      var file = req.files.upfile,
        name = file.name,
        type = file.mimetype;
      var uploadpath = __dirname + '/uploads/' + name;
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
};