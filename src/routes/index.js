const router = require('express').Router();
const { auths } = require('./auth');
const { users } = require('./user');
const chat = require('./chat');

router.use('/auths', auths);
router.use('/users', users);
router.use('/chat', chat);

module.exports = { router };
