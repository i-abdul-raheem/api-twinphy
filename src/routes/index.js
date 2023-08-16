const express= require('express');
const {posts} = require('./posts');
const { auths } = require('./auth');
const { users } = require('./user');
const router = require('express').Router();

router.use('/posts', posts);
router.use('/posts/:id', posts);
router.use('/auths', auths);
router.use('/users', users);

module.exports = { router };
