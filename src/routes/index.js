const express= require('express');
const postRoutes= require('./posts');
const {posts} = require('./posts');
const router = require('express').Router();

router.use('/posts', posts);
router.use('/posts/:id', posts);

module.exports= router;