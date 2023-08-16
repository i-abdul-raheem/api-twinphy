const router = require('express').Router();
const { users } = require('./user');

router.use('/users', users);