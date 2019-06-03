var Contact = require('./contactModel');
var _ = require('lodash');

exports.params = function(req, res, next, id) {
  Contact.findById(id)
    .then(function(contact) {
      if (!contact) {
        next(new Error('No contact with that id'));
      } else {
        req.contact = contact;
        next();
      }
    }, function(err) {
      next(err);
    });
};

exports.get = function(req, res, next) {
  Contact.find({})
    .then(function(contacts){
      res.json(contacts);
    }, function(err){
      next(err);
    });
};

exports.getOne = function(req, res, next) {
  var contact = req.contact;
  res.json(contact);
};

exports.put = function(req, res, next) {
  var contact = req.contact;

  var update = req.body;

  _.merge(contact, update);

  contact.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  })
};

exports.post = function(req, res, next) {
  var newcontact = req.body;

  Contact.create(newcontact)
    .then(function(contact) {
      res.json(contact);
    }, function(err) {
      next(err);
    });
};

exports.delete = async function(req, res, next) {
    req.contact.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};
