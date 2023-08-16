const router = require('express').Router();
const { auths } = require('./auth');
const { users } = require('./user');
const { posts } = require('./posts');
const chat = require('./chat');

router.use('/auths', auths);
router.use('/users', users);
router.use('/posts', posts);
router.use('/chat', chat);

module.exports = { router };
