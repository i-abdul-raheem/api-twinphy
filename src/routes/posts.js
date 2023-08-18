const express= require('express');
const router= require('express').Router();
const {Post}=require('../handlers/Post');

const handler= new Post();
router.get('/', handler.getAllPosts);
router.get("/user/:id", handler.getPostByUSerId);
router.delete('/:id', handler.deletePostById);
router.post('/', handler.createPost);
module.exports={posts: router};


