const router = require('express').Router();
const { auths } = require('./auth');
const { users } = require('./user');
const postRoutes= require('./posts');
const {posts} = require('./posts');

router.use('/auths', auths);
router.use('/users', users);

module.exports = { router };



router.use('/posts', posts);
router.use('/posts/:id', posts);

module.exports= router;