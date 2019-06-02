var Author = require('./authorModel');
var _ = require('lodash');

exports.params = function(req, res, next, id) {
  Author.findById(id)
    .then(function(author) {
      if (!author) {
        next(new Error('No author with that id'));
      } else {
        req.author = author;
        next();
      }
    }, function(err) {
      next(err);
    });
};

exports.get = function(req, res, next) {
  Author.find({})
    .then(function(authors){
      res.json(authors);
    }, function(err){
      next(err);
    });
};

exports.getOne = function(req, res, next) {
  var author = req.author;
  res.json(author);
};

exports.put = function(req, res, next) {
  var author = req.author;

  var update = req.body;

  _.merge(author, update);

  author.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  })
};

exports.post = function(req, res, next) {
  var newauthor = req.body;

  Author.create(newauthor)
    .then(function(author) {
      res.json(author);
    }, function(err) {
      next(err);
    });
};

exports.delete = function(req, res, next) {
  req.author.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};
