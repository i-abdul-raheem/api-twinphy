const express= require('express');
const router= require('express').Router();
const {Post}=require('../handlers/Post');

const handler= new Post();
router.get('/', handler.getAllPosts);
router.get("/:id", handler.getPostByUSerId);
router.delete('/:id', handler.deletePostById);
router.post('/', handler.createPost);
router.post('/report/:id', handler.reportPost);
router.patch('/likes',handler.postLikes);
module.exports={posts: router};


