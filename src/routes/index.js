const router = require('express').Router();
const { auths } = require('./auth');
const { users } = require('./user');
const chat = require('./chat');
const { posts } = require('./posts');

router.use('/auths', auths);
router.use('/users', users);
router.use('/chat', chat);
router.use('/posts', posts);


module.exports = { router };
