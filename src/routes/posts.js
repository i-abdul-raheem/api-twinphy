const express= require('express');
const router= require('express').Router();
const {Post}=require('../handlers/Post')
const {getAllPosts} =require('../handlers/Post')

const handler= new Post();
router.get('/', handler.getAllPosts);
router.get('/:id', handler.getPostById);
router.delete('/:id', handler.deletePostById);
module.exports={posts: router};