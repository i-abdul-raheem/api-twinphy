const router = require('express').Router();
const { auths } = require('./auth');
const { users } = require('./user');
const {posts} = require('./posts');

router.use('/auths', auths);
router.use('/users', users);
router.use('/posts', posts);

module.exports = router 
