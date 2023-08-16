const router = require('express').Router();
const { auths } = require('./auth');
const { users } = require('./user');

router.use('/auths', auths);
router.use('/users', users);

module.exports = { router };