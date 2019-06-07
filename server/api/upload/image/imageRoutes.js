var router = require('express').Router();
var controller = require('./imageController');

router.route('/')
    .get(controller.get)
    .post(controller.post)


module.exports = router;