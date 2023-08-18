const express= require('express');
const router= require('express').Router();
const {Post}=require('../handlers/Post');

const handler= new Post();
router.get('/', handler.getAllPosts);

router.delete('/:id', handler.deletePostById);
router.post('/:id', handler.createPost);
module.exports={posts: router};


// const express = require('express');
// const router = require('express').Router();
// const multer = require('multer');
// const { Post } = require('../handlers/Post');

// const handler = new Post();

// const storage = multer.memoryStorage(); // Store files in memory
// const upload = multer({ storage: storage });

// router.post('/', upload.single('file'), handler.createPost);

// module.exports = { posts: router };
