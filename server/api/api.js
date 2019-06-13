var router = require('express').Router();

// api router will mount other routers
// for all our resources

//router.use('/users', require('./user/userRoutes'));
router.use('/categories', require('./category/categoryRoutes'));
router.use('/posts', require('./post/postRoutes'));
router.use('/uploads', require('./upload/uploadRoutes'));

router.use('/authors', require('./author/authorRoutes'));
router.use('/contacts', require('./contact/contactRoutes'));
router.use('/abouts', require('./about/aboutRoutes'));


module.exports = router;
